import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import { mostLeafwardCommonAncestor } from "./mostLeafwardCommonAncestor.js"
import { resolveLabelToNode } from "./resolveLabelToNode.js"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import type { CladogramTree, CladogramTreeNode } from "./types.js"

export type TerminalTaxon = Readonly<{
    label: string
    nodeUuid: string
}>

export type BuildTreeFromTerminalsResult = Readonly<{
    tree: CladogramTree
    /** Concestor-only topology; unlabeled internals are `(…)` groups. Feed to `parse_newick` for the usual workflow. */
    newick: string
    /** PhyloPic node UUID for each tree node id (tips and unlabeled internals). */
    nodeUuidByTreeId: Readonly<Record<string, string>>
    terminals: readonly TerminalTaxon[]
    warnings: readonly string[]
}>

/** UUID of the child on the path from `ancestorUuid` toward the tip (lineage is tip → root). */
export const childTowardTip = (lineage: readonly string[], ancestorUuid: string): string | null => {
    const idx = lineage.indexOf(ancestorUuid)
    if (idx <= 0) {
        return null
    }
    return lineage[idx - 1] ?? null
}

const partitionTipsByChild = (
    nodeUuid: string,
    tips: readonly TerminalTaxon[],
    lineagesByTipUuid: ReadonlyMap<string, readonly string[]>,
): Map<string, TerminalTaxon[]> => {
    const buckets = new Map<string, TerminalTaxon[]>()
    for (const tip of tips) {
        const lineage = lineagesByTipUuid.get(tip.nodeUuid)!
        const child = childTowardTip(lineage, nodeUuid)
        if (!child) {
            if (tip.nodeUuid === nodeUuid) {
                const solo = buckets.get(nodeUuid) ?? []
                solo.push(tip)
                buckets.set(nodeUuid, solo)
            }
            continue
        }
        const list = buckets.get(child) ?? []
        list.push(tip)
        buckets.set(child, list)
    }
    return buckets
}

/** Skip PhyloPic nodes that do not branch among the selected terminals (unary chains). */
export const concestorNodeUuid = (
    startUuid: string,
    tips: readonly TerminalTaxon[],
    lineagesByTipUuid: ReadonlyMap<string, readonly string[]>,
): string => {
    let nodeUuid = startUuid
    while (tips.length > 1) {
        const buckets = partitionTipsByChild(nodeUuid, tips, lineagesByTipUuid)
        if (buckets.size !== 1) {
            break
        }
        const onlyChild = buckets.keys().next().value
        if (!onlyChild || onlyChild === nodeUuid) {
            break
        }
        nodeUuid = onlyChild
    }
    return nodeUuid
}

/** Smallest terminal count first; ties broken by lexicographic min label in the branch. */
export const compareTerminalBranches = (
    a: readonly TerminalTaxon[],
    b: readonly TerminalTaxon[],
): number => {
    const countDiff = a.length - b.length
    if (countDiff !== 0) {
        return countDiff
    }
    const alpha = (tips: readonly TerminalTaxon[]) =>
        [...tips]
            .map(t => t.label)
            .sort((x, y) => x.localeCompare(y, undefined, { sensitivity: "base" }))[0] ?? ""
    return alpha(a).localeCompare(alpha(b), undefined, { sensitivity: "base" })
}

export const buildTreeFromTerminalLineages = (
    terminals: readonly TerminalTaxon[],
    lineagesByTipUuid: ReadonlyMap<string, readonly string[]>,
): { root: CladogramTreeNode; nodeUuidByTreeId: Record<string, string> } => {
    if (!terminals.length) {
        throw new Error("At least one terminal taxon is required.")
    }
    const lineages = terminals.map(t => {
        const lineage = lineagesByTipUuid.get(t.nodeUuid)
        if (!lineage?.length) {
            throw new Error(`Missing lineage for terminal "${t.label}" (${t.nodeUuid}).`)
        }
        return lineage
    })
    const nodeUuidByTreeId: Record<string, string> = {}
    let nextId = 0

    /** Concestor tree: recurse on tip subsets by MRCA, not every PhyloPic bifurcation on the paths. */
    const buildAt = (tips: readonly TerminalTaxon[]): CladogramTreeNode => {
        if (tips.length === 1) {
            const id = `n${nextId++}`
            nodeUuidByTreeId[id] = tips[0]!.nodeUuid
            return { id, label: tips[0]!.label, children: [] }
        }

        const subsetLineages = tips.map(t => lineagesByTipUuid.get(t.nodeUuid)!)
        const mrcaUuid = mostLeafwardCommonAncestor(subsetLineages)
        if (!mrcaUuid) {
            throw new Error("Could not resolve a common ancestor from terminal lineages.")
        }

        const splitUuid = concestorNodeUuid(mrcaUuid, tips, lineagesByTipUuid)
        const buckets = partitionTipsByChild(splitUuid, tips, lineagesByTipUuid)
        if (buckets.size <= 1) {
            throw new Error("Expected a concestor split among terminal taxa.")
        }

        const childUuids = [...buckets.keys()].sort((a, b) =>
            compareTerminalBranches(buckets.get(a)!, buckets.get(b)!),
        )

        const children = childUuids.map(childUuid => buildAt(buckets.get(childUuid)!))
        const id = `n${nextId++}`
        nodeUuidByTreeId[id] = splitUuid
        return { id, children }
    }

    return { root: buildAt(terminals), nodeUuidByTreeId }
}

export const buildTreeFromTerminalLabels = async (
    client: PhyloPicClient,
    labels: readonly string[],
): Promise<BuildTreeFromTerminalsResult> => {
    const trimmed = labels.map(l => l.trim()).filter(Boolean)
    if (!trimmed.length) {
        throw new Error("At least one terminal label is required.")
    }
    const warnings: string[] = []
    const terminals: TerminalTaxon[] = []
    for (const label of trimmed) {
        const resolved = await resolveLabelToNode(client, label, { contextLabels: trimmed })
        terminals.push({ label, nodeUuid: resolved.nodeUuid })
        warnings.push(...resolved.warnings)
    }
    const lineagesByTipUuid = new Map<string, readonly string[]>()
    for (const t of terminals) {
        lineagesByTipUuid.set(t.nodeUuid, await fetchLineageUuids(client, t.nodeUuid))
    }
    const { root, nodeUuidByTreeId } = buildTreeFromTerminalLineages(terminals, lineagesByTipUuid)
    const tree = { root, tipCount: terminals.length }
    return {
        tree,
        newick: cladogramTreeToNewick(root),
        nodeUuidByTreeId,
        terminals,
        warnings,
    }
}
