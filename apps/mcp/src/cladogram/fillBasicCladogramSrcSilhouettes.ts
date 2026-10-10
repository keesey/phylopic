import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { chooseFinestPhylopicClade, type PhylopicCladeCandidate } from "./chooseFinestPhylopicClade.js"
import { isUnlabeledInternalNode } from "./labeledSubcladeRoots.js"
import { pickImage } from "./pickImage.js"
import {
    buildResolvableCladeCatalog,
    formatSmallestResolvableSupercladeReport,
    type ResolvableCladeCatalog,
} from "./resolvableCladeCatalog.js"
import type { CladogramTreeNode, LicenseFilters } from "./types.js"

export type BasicCladogramImagePick = Readonly<{
    vectorUrl?: string
    uuid?: string
}>

export type FillBasicCladogramSrcSilhouettesOptions = Readonly<{
    /** Also use catalog descendant MRCA for unlabeled internals (default true). */
    includeDescendantMrcaForUnlabeled?: boolean
    onDiagnostic?: (line: string) => void
}>

const collectNodeIds = (root: CladogramTreeNode, out: string[] = []): string[] => {
    out.push(root.id)
    for (const c of root.children) collectNodeIds(c, out)
    return out
}

const srcCandidatesForNode = (
    nodeId: string,
    catalog: ResolvableCladeCatalog,
    treeNode: CladogramTreeNode,
    includeMrcaForUnlabeled: boolean,
): PhylopicCladeCandidate[] => {
    const out: PhylopicCladeCandidate[] = []
    const tip = catalog.tipClades[nodeId]
    if (tip?.assignmentMethod === "smallest_resolvable_superclade") {
        out.push({ phylopicUuid: tip.phylopicUuid, rank: tip.rank })
    }
    for (const a of catalog.assignments) {
        if (a.nodeId !== nodeId) continue
        if (a.method === "smallest_resolvable_superclade") {
            out.push({ phylopicUuid: a.phylopicUuid, rank: a.rank ?? "other" })
        } else if (
            includeMrcaForUnlabeled &&
            a.method === "descendant_mrca" &&
            isUnlabeledInternalNode(treeNode)
        ) {
            out.push({ phylopicUuid: a.phylopicUuid, rank: a.rank ?? "other" })
        }
    }
    return out
}

const findTreeNode = (root: CladogramTreeNode, nodeId: string): CladogramTreeNode | undefined => {
    if (root.id === nodeId) return root
    for (const c of root.children) {
        const hit = findTreeNode(c, nodeId)
        if (hit) return hit
    }
    return undefined
}

/**
 * After normal label resolve/picks: assign catalog SRS (and optional MRCA for unlabeled internals),
 * then pick silhouettes with filter_clade only. Not used by collection-page cladograms.
 */
export const fillBasicCladogramSrcSilhouettes = async (
    client: PhyloPicClient,
    root: CladogramTreeNode,
    contextLabels: readonly string[],
    state: {
        nodeUuids: Record<string, string>
        images: Record<string, BasicCladogramImagePick | null>
    },
    filters: LicenseFilters,
    options: FillBasicCladogramSrcSilhouettesOptions = {},
): Promise<void> => {
    const onDiagnostic = options.onDiagnostic ?? (() => {})
    const includeMrca = options.includeDescendantMrcaForUnlabeled ?? true

    const catalog = await buildResolvableCladeCatalog(client, root)
    for (const line of formatSmallestResolvableSupercladeReport(catalog.assignments)) {
        onDiagnostic(line)
    }

    for (const nodeId of collectNodeIds(root)) {
        if (state.images[nodeId]?.vectorUrl) continue

        const treeNode = findTreeNode(root, nodeId)
        if (!treeNode) continue

        const candidates = srcCandidatesForNode(nodeId, catalog, treeNode, includeMrca)
        if (!candidates.length) continue

        const finest = await chooseFinestPhylopicClade(client, candidates)
        if (!finest) continue

        state.nodeUuids[nodeId] = finest.phylopicUuid

        try {
            const pick = await pickImage(client, finest.phylopicUuid, {
                ...filters,
                clade_list_only: true,
            })
            if (pick.image?.vectorUrl) {
                state.images[nodeId] = {
                    vectorUrl: pick.image.vectorUrl,
                    uuid: pick.image.uuid,
                }
            }
        } catch {
            /* gap */
        }
    }
}
