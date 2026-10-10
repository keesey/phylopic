import type { ImageWithEmbedded } from "@phylopic/api-models"
import { buildTreeFromTerminalLineages } from "./buildTreeFromTerminalLineages.js"
import { fetchLineageEntries, type LineageFetcher } from "./fetchLineageUuids.js"
import { nodeUuidFromSpecificNodeLink } from "./imageRecord.js"
import { terminalLabelFromImage } from "./terminalLabelFromImage.js"
import type { CladogramTreeNode, CollectionCladogramTree, TerminalTaxon } from "./types.js"

const terminalsFromImages = (
    images: readonly ImageWithEmbedded[],
): { terminals: TerminalTaxon[]; imageUuidByNodeUuid: Map<string, string>; warnings: string[] } => {
    const warnings: string[] = []
    const imageUuidByNodeUuid = new Map<string, string>()
    const terminals: TerminalTaxon[] = []
    for (const image of images) {
        const nodeUuid = nodeUuidFromSpecificNodeLink(image)
        if (!nodeUuid) {
            warnings.push(`Skipping image ${image.uuid}: no specific node.`)
            continue
        }
        const prior = imageUuidByNodeUuid.get(nodeUuid)
        if (prior) {
            warnings.push(`Multiple collection images for node ${nodeUuid}; using ${prior}.`)
            continue
        }
        imageUuidByNodeUuid.set(nodeUuid, String(image.uuid))
        terminals.push({ label: terminalLabelFromImage(image), nodeUuid })
    }
    if (!terminals.length) {
        throw new Error("No collection images with resolvable specific nodes.")
    }
    return { terminals, imageUuidByNodeUuid, warnings }
}

/** Lineage UUID lists from the API: index 0 is the node, then ancestors toward the root. */
export const isStrictLineageAncestor = (
    ancestorUuid: string,
    descendantUuid: string,
    lineagesByNodeUuid: ReadonlyMap<string, readonly string[]>,
): boolean => {
    if (ancestorUuid === descendantUuid) {
        return false
    }
    const lineage = lineagesByNodeUuid.get(descendantUuid)
    if (!lineage) {
        return false
    }
    const index = lineage.indexOf(ancestorUuid)
    return index > 0
}

/**
 * Drop collection taxa that are ancestors of other collection specific nodes on the same cladogram.
 * Those images are not tips; the node still appears as a labeled internal from lineage metadata.
 */
export const leafwardCollectionTerminals = (
    terminals: readonly TerminalTaxon[],
    lineagesByNodeUuid: ReadonlyMap<string, readonly string[]>,
): { terminals: TerminalTaxon[]; warnings: string[] } => {
    const warnings: string[] = []
    const kept = terminals.filter(candidate => {
        for (const other of terminals) {
            if (other.nodeUuid === candidate.nodeUuid) {
                continue
            }
            if (isStrictLineageAncestor(candidate.nodeUuid, other.nodeUuid, lineagesByNodeUuid)) {
                warnings.push(
                    `Treating "${candidate.label}" as an ancestral taxon (not a tip); cladogram tips use more specific collection taxa.`,
                )
                return false
            }
        }
        return true
    })
    return { terminals: kept, warnings }
}

/** Set `label` on unlabeled internal nodes from PhyloPic lineage titles (tips keep collection labels). */
export const labelAncestralCladogramNodes = (
    root: CladogramTreeNode,
    nodeUuidByTreeId: Readonly<Record<string, string>>,
    titleByNodeUuid: ReadonlyMap<string, string>,
): CladogramTreeNode => {
    const visit = (node: CladogramTreeNode): CladogramTreeNode => {
        const children = node.children.map(visit)
        if (node.label || node.children.length === 0) {
            return { ...node, children }
        }
        const nodeUuid = nodeUuidByTreeId[node.id]
        const title = nodeUuid ? titleByNodeUuid.get(nodeUuid) : undefined
        return title ? { ...node, label: title, children } : { ...node, children }
    }
    return visit(root)
}

export const buildCollectionCladogramTree = async (
    images: readonly ImageWithEmbedded[],
    fetchLineagePage: LineageFetcher,
): Promise<CollectionCladogramTree> => {
    const { terminals, imageUuidByNodeUuid, warnings } = terminalsFromImages(images)
    const lineagesByTipUuid = new Map<string, readonly string[]>()
    const titleByNodeUuid = new Map<string, string>()
    for (const t of terminals) {
        const entries = await fetchLineageEntries(fetchLineagePage, t.nodeUuid)
        lineagesByTipUuid.set(
            t.nodeUuid,
            entries.map(entry => entry.uuid),
        )
        for (const entry of entries) {
            if (entry.title) {
                titleByNodeUuid.set(entry.uuid, entry.title)
            }
        }
    }
    const leafward = leafwardCollectionTerminals(terminals, lineagesByTipUuid)
    warnings.push(...leafward.warnings)
    const tipTerminals = leafward.terminals
    if (tipTerminals.length < 2) {
        throw new Error(
            "Need at least two collection images on leaf taxa (not ancestral to other silhouettes in this collection).",
        )
    }
    const { root, nodeUuidByTreeId } = buildTreeFromTerminalLineages(tipTerminals, lineagesByTipUuid)
    const labeledRoot = labelAncestralCladogramNodes(root, nodeUuidByTreeId, titleByNodeUuid)
    const imageUuidByTreeId: Record<string, string> = {}
    const assignCollectionImages = (node: CladogramTreeNode): void => {
        const nodeUuid = nodeUuidByTreeId[node.id]
        if (nodeUuid) {
            const imageUuid = imageUuidByNodeUuid.get(nodeUuid)
            if (imageUuid) {
                imageUuidByTreeId[node.id] = imageUuid
            }
        }
        for (const child of node.children) {
            assignCollectionImages(child)
        }
    }
    assignCollectionImages(labeledRoot)
    return {
        tree: { root: labeledRoot, tipCount: tipTerminals.length },
        nodeUuidByTreeId,
        imageUuidByTreeId,
        terminals: tipTerminals,
        warnings,
    }
}
