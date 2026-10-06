import type { ImageWithEmbedded } from "@phylopic/api-models"
import { buildTreeFromTerminalLineages } from "./buildTreeFromTerminalLineages.js"
import { fetchLineageUuids, type LineageFetcher } from "./fetchLineageUuids.js"
import { nodeUuidFromSpecificNodeLink } from "./imageRecord.js"
import { terminalLabelFromImage } from "./terminalLabelFromImage.js"
import type { CollectionCladogramTree, TerminalTaxon } from "./types.js"

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

export const buildCollectionCladogramTree = async (
    images: readonly ImageWithEmbedded[],
    fetchLineagePage: LineageFetcher,
): Promise<CollectionCladogramTree> => {
    const { terminals, imageUuidByNodeUuid, warnings } = terminalsFromImages(images)
    const lineagesByTipUuid = new Map<string, readonly string[]>()
    for (const t of terminals) {
        lineagesByTipUuid.set(t.nodeUuid, await fetchLineageUuids(fetchLineagePage, t.nodeUuid))
    }
    const { root, nodeUuidByTreeId } = buildTreeFromTerminalLineages(terminals, lineagesByTipUuid)
    const imageUuidByTreeId: Record<string, string> = {}
    for (const [treeId, nodeUuid] of Object.entries(nodeUuidByTreeId)) {
        const imageUuid = imageUuidByNodeUuid.get(nodeUuid)
        if (imageUuid) {
            imageUuidByTreeId[treeId] = imageUuid
        }
    }
    return {
        tree: { root, tipCount: terminals.length },
        nodeUuidByTreeId,
        imageUuidByTreeId,
        terminals,
        warnings,
    }
}
