import { normalizeUUID } from "@phylopic/utils"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { assertResolvedAncestorOfDescendants } from "./cladogramResolutionTrust.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import { resolveMrcaFromDescendants } from "./resolveMrcaFromDescendants.js"
import { resolveLabelForCladogramNode } from "./resolveLabelViaDescendantPhylogeny.js"
import { resolveSmallestSuperclade, type SupercladeRank } from "./resolveSmallestSuperclade.js"
import type { CladogramTreeNode } from "./types.js"

export type CladeAssignmentMethod =
    | "trusted_label"
    | "smallest_resolvable_superclade"
    | "descendant_mrca"

export type ResolvableClade = Readonly<{
    phylopicUuid: string
    phylopicTitle?: string
    rank: SupercladeRank
    /** Label or taxon string used to obtain this clade. */
    sourceLabel: string
    assignmentMethod: CladeAssignmentMethod
}>

export type NewickNodeCladeAssignment = Readonly<{
    nodeId: string
    newickLabel?: string
    phylopicUuid: string
    phylopicTitle?: string
    rank?: SupercladeRank
    method: CladeAssignmentMethod
}>

export type ResolvableCladeCatalog = Readonly<{
    /** Finest resolvable PhyloPic clade per tip (for external / GBIF lineage). */
    tipClades: Readonly<Record<string, ResolvableClade>>
    /** Unique clades in catalog order of discovery. */
    clades: readonly ResolvableClade[]
    /** Newick node id → PhyloPic UUID (often an internal node). */
    nodeAssignment: Readonly<Record<string, string>>
    /** Per-node resolution path (tips + assigned internals). */
    assignments: readonly NewickNodeCladeAssignment[]
}>

const labelByNodeId = (root: CladogramTreeNode): ReadonlyMap<string, string | undefined> => {
    const map = new Map<string, string | undefined>()
    const walk = (n: CladogramTreeNode) => {
        map.set(n.id, n.label)
        n.children.forEach(walk)
    }
    walk(root)
    return map
}

/** stderr lines listing Newick nodes assigned via smallest resolvable superclade (SRC). */
export const formatSmallestResolvableSupercladeReport = (
    assignments: readonly NewickNodeCladeAssignment[],
): readonly string[] => {
    const src = assignments.filter(a => a.method === "smallest_resolvable_superclade")
    if (!src.length) return ["Smallest resolvable superclade (SRC): none"]
    const lines = [`Smallest resolvable superclade (SRC): ${src.length} node(s)`]
    for (const a of src) {
        const name = a.newickLabel ? ` "${a.newickLabel}"` : ""
        const title = a.phylopicTitle ?? a.phylopicUuid
        const rank = a.rank ? ` [${a.rank}]` : ""
        lines.push(`  ${a.nodeId}${name} → ${title}${rank}`)
    }
    return lines
}

type MutableTreeNode = CladogramTreeNode & {
    parent?: MutableTreeNode
    children: MutableTreeNode[]
}

const cloneWithParent = (n: CladogramTreeNode, parent?: MutableTreeNode): MutableTreeNode => {
    const node: MutableTreeNode = {
        id: n.id,
        ...(n.label !== undefined ? { label: n.label } : {}),
        ...(n.branchLength !== undefined ? { branchLength: n.branchLength } : {}),
        children: [],
        parent,
    }
    node.children = n.children.map(c => cloneWithParent(c, node))
    return node
}

const collectFlat = (node: MutableTreeNode, out: MutableTreeNode[]) => {
    out.push(node)
    for (const c of node.children) collectFlat(c, out)
}

const isTip = (n: MutableTreeNode) => n.children.length === 0

const tipsUnder = (n: MutableTreeNode): MutableTreeNode[] => {
    if (isTip(n)) return [n]
    return n.children.flatMap(c => tipsUnder(c))
}

const labeledAncestorsRootToParent = (node: MutableTreeNode): string[] => {
    const chain: string[] = []
    let p = node.parent
    while (p) {
        if (p.label) chain.unshift(p.label)
        p = p.parent
    }
    return chain
}

const depth = (n: MutableTreeNode): number => {
    let d = 0
    let p = n.parent
    while (p) {
        d++
        p = p.parent
    }
    return d
}

const toClade = (
    result: { nodeUuid: string; title?: string },
    sourceLabel: string,
    assignmentMethod: CladeAssignmentMethod,
    rank: SupercladeRank = "other",
): ResolvableClade => ({
    phylopicUuid: result.nodeUuid,
    phylopicTitle: result.title,
    rank,
    sourceLabel,
    assignmentMethod,
})

const isAncestorOf = async (client: PhyloPicClient, ancestorUuid: string, descendantUuid: string): Promise<boolean> => {
    const lineage = await fetchLineageUuids(client, descendantUuid)
    const norm = normalizeUUID(ancestorUuid)
    return lineage.some(u => normalizeUUID(u) === norm)
}

const isAncestorOfAll = async (
    client: PhyloPicClient,
    ancestorUuid: string,
    descendantUuids: readonly string[],
): Promise<boolean> => {
    for (const d of descendantUuids) {
        if (!(await isAncestorOf(client, ancestorUuid, d))) return false
    }
    return true
}

/** Smallest resolvable PhyloPic clade for each tip label (external + Newick context). */
export const buildTipResolvableClades = async (
    client: PhyloPicClient,
    root: CladogramTreeNode,
    contextLabels: readonly string[],
    usedSrcUuids: Set<string> = new Set(),
): Promise<Readonly<Record<string, ResolvableClade>>> => {
    const tree = cloneWithParent(root)
    const all: MutableTreeNode[] = []
    collectFlat(tree, all)
    const out: Record<string, ResolvableClade> = {}

    for (const n of all) {
        if (!isTip(n) || !n.label) continue
        const ancestors = labeledAncestorsRootToParent(n)
        try {
            const trusted = await resolveLabelForCladogramNode(client, n.label, [], {
                contextLabels,
                labeledAncestorLabels: ancestors,
            })
            out[n.id] = toClade(trusted, n.label, "trusted_label", "species")
            continue
        } catch {
            /* fall through */
        }
        const fallback = await resolveSmallestSuperclade(client, n.label, {
            contextLabels,
            labeledAncestorLabels: ancestors,
        })
        if (fallback) {
            const key = normalizeUUID(fallback.nodeUuid)
            if (usedSrcUuids.has(key)) continue
            usedSrcUuids.add(key)
            out[n.id] = toClade(fallback, n.label, "smallest_resolvable_superclade", fallback.rank)
        }
    }
    return out
}

/** Assign resolvable clades to internal Newick nodes using labels, tip clades, and PhyloPic MRCA. */
export const assignResolvableCladesToNewickNodes = async (
    client: PhyloPicClient,
    root: CladogramTreeNode,
    tipClades: Readonly<Record<string, ResolvableClade>>,
    contextLabels: readonly string[],
    usedSrcUuids: Set<string> = new Set(),
): Promise<readonly NewickNodeCladeAssignment[]> => {
    const tree = cloneWithParent(root)
    const all: MutableTreeNode[] = []
    collectFlat(tree, all)
    const internals = all.filter(n => !isTip(n)).sort((a, b) => depth(b) - depth(a))
    const assignments: NewickNodeCladeAssignment[] = []

    for (const n of internals) {
        const tips = tipsUnder(n)
        const tipUuids = tips.map(t => tipClades[t.id]?.phylopicUuid).filter((u): u is string => Boolean(u))
        if (!tipUuids.length) continue

        let candidateUuid: string | undefined
        let candidateTitle: string | undefined
        let candidateRank: SupercladeRank | undefined
        let method: CladeAssignmentMethod | undefined
        let warnings: readonly string[] = []

        if (n.label) {
            try {
                const resolved = await resolveLabelForCladogramNode(client, n.label, tipUuids, {
                    contextLabels,
                    labeledAncestorLabels: labeledAncestorsRootToParent(n),
                })
                candidateUuid = resolved.nodeUuid
                candidateTitle = resolved.title
                method = "trusted_label"
                warnings = resolved.warnings
            } catch {
                const fb = await resolveSmallestSuperclade(client, n.label, {
                    contextLabels,
                    labeledAncestorLabels: labeledAncestorsRootToParent(n),
                })
                const srcKey = fb ? normalizeUUID(fb.nodeUuid) : undefined
                if (
                    fb &&
                    srcKey &&
                    !usedSrcUuids.has(srcKey) &&
                    (await isAncestorOfAll(client, fb.nodeUuid, tipUuids))
                ) {
                    usedSrcUuids.add(srcKey)
                    candidateUuid = fb.nodeUuid
                    candidateTitle = fb.title
                    candidateRank = fb.rank
                    method = "smallest_resolvable_superclade"
                    warnings = fb.warnings
                }
            }
        }

        if (!candidateUuid) {
            const mrca = await resolveMrcaFromDescendants(client, tipUuids)
            if (mrca.mrcaUuid && (await isAncestorOfAll(client, mrca.mrcaUuid, tipUuids))) {
                candidateUuid = mrca.mrcaUuid
                method = "descendant_mrca"
                warnings = mrca.warnings
            }
        }

        if (!candidateUuid || !method) continue

        try {
            await assertResolvedAncestorOfDescendants(client, candidateUuid, tipUuids)
            assignments.push({
                nodeId: n.id,
                ...(n.label !== undefined ? { newickLabel: n.label } : {}),
                phylopicUuid: candidateUuid,
                ...(candidateTitle !== undefined ? { phylopicTitle: candidateTitle } : {}),
                ...(candidateRank !== undefined ? { rank: candidateRank } : {}),
                method,
            })
            for (const w of warnings) {
                /* caller logs */
            }
        } catch {
            /* homonym or inconsistent hierarchy — skip assignment */
        }
    }

    return assignments
}

export const buildResolvableCladeCatalog = async (
    client: PhyloPicClient,
    root: CladogramTreeNode,
): Promise<ResolvableCladeCatalog> => {
    const allLabels: string[] = []
    const walk = (n: CladogramTreeNode) => {
        if (n.label) allLabels.push(n.label)
        n.children.forEach(walk)
    }
    walk(root)

    const labelsById = labelByNodeId(root)
    const usedSrcUuids = new Set<string>()
    const tipClades = await buildTipResolvableClades(client, root, allLabels, usedSrcUuids)
    const internalAssignments = await assignResolvableCladesToNewickNodes(
        client,
        root,
        tipClades,
        allLabels,
        usedSrcUuids,
    )
    const nodeAssignment = Object.fromEntries(internalAssignments.map(a => [a.nodeId, a.phylopicUuid]))

    const assignments: NewickNodeCladeAssignment[] = []
    for (const [nodeId, c] of Object.entries(tipClades)) {
        assignments.push({
            nodeId,
            newickLabel: labelsById.get(nodeId),
            phylopicUuid: c.phylopicUuid,
            phylopicTitle: c.phylopicTitle,
            rank: c.rank,
            method: c.assignmentMethod,
        })
    }
    assignments.push(...internalAssignments)

    const seen = new Set<string>()
    const clades: ResolvableClade[] = []
    const push = (c: ResolvableClade) => {
        const k = normalizeUUID(c.phylopicUuid)
        if (seen.has(k)) return
        seen.add(k)
        clades.push(c)
    }
    for (const c of Object.values(tipClades)) push(c)
    for (const a of internalAssignments) {
        push({
            phylopicUuid: a.phylopicUuid,
            phylopicTitle: a.phylopicTitle,
            sourceLabel: a.newickLabel ?? a.nodeId,
            rank: a.rank ?? "other",
            assignmentMethod: a.method,
        })
    }

    return { tipClades, clades, nodeAssignment, assignments }
}
