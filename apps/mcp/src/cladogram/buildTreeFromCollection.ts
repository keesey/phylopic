import type { ImageWithEmbedded } from "@phylopic/api-models"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import {
    fetchPermalinkCollectionSnapshot,
    permalinkUrlFromHash,
    parsePermalinkHash,
    type CollectionPermalinkSnapshot,
} from "../collection/collectionPermalink.js"
import { loadCollectionImages } from "../collection/loadCollectionImages.js"
import {
    buildTreeFromTerminalLineages,
    type BuildTreeFromTerminalsResult,
    type TerminalTaxon,
} from "./buildTreeFromTerminals.js"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import { nodeUuidFromSpecificNodeLink } from "./imageRecord.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import { terminalLabelFromImage } from "./terminalLabelFromImage.js"

export type BuildTreeFromCollectionResult = BuildTreeFromTerminalsResult &
    Readonly<{
        sourceCollectionUuid: string
        /** Set when the tree was built from a permalink snapshot. */
        sourcePermalinkUrl?: string
        /** Fixed silhouette UUID for each labeled tip tree id. */
        imageUuidByTreeId: Readonly<Record<string, string>>
        imageUuids: readonly string[]
    }>

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

const buildFromImages = async (
    client: PhyloPicClient,
    images: readonly ImageWithEmbedded[],
    sourceCollectionUuid: string,
    sourcePermalinkUrl?: string,
): Promise<BuildTreeFromCollectionResult> => {
    const { terminals, imageUuidByNodeUuid, warnings } = terminalsFromImages(images)
    const lineagesByTipUuid = new Map<string, readonly string[]>()
    for (const t of terminals) {
        lineagesByTipUuid.set(t.nodeUuid, await fetchLineageUuids(client, t.nodeUuid))
    }
    const { root, nodeUuidByTreeId } = buildTreeFromTerminalLineages(terminals, lineagesByTipUuid)
    const tree = { root, tipCount: terminals.length }
    const imageUuidByTreeId: Record<string, string> = {}
    for (const [treeId, nodeUuid] of Object.entries(nodeUuidByTreeId)) {
        const imageUuid = imageUuidByNodeUuid.get(nodeUuid)
        if (imageUuid) {
            imageUuidByTreeId[treeId] = imageUuid
        }
    }
    const imageUuids = [...new Set(Object.values(imageUuidByTreeId))]
    return {
        tree,
        newick: cladogramTreeToNewick(root),
        nodeUuidByTreeId,
        terminals,
        warnings,
        sourceCollectionUuid,
        sourcePermalinkUrl,
        imageUuidByTreeId,
        imageUuids,
    }
}

export const buildTreeFromCollectionUuid = async (
    client: PhyloPicClient,
    collectionUuid: string,
): Promise<BuildTreeFromCollectionResult> => {
    const images = await loadCollectionImages(client, collectionUuid)
    if (!images.length) {
        throw new Error(`Collection ${collectionUuid} has no images.`)
    }
    return buildFromImages(client, images, collectionUuid)
}

export const buildTreeFromPermalink = async (
    client: PhyloPicClient,
    permalinkUrlOrHash: string,
): Promise<BuildTreeFromCollectionResult> => {
    const snapshot = await fetchPermalinkCollectionSnapshot(permalinkUrlOrHash)
    return buildTreeFromPermalinkSnapshot(client, snapshot, permalinkUrlOrHash)
}

export const buildTreeFromPermalinkSnapshot = async (
    client: PhyloPicClient,
    snapshot: CollectionPermalinkSnapshot,
    permalinkUrlOrHash?: string,
): Promise<BuildTreeFromCollectionResult> => {
    const hash = permalinkUrlOrHash ? parsePermalinkHash(permalinkUrlOrHash) : undefined
    const sourcePermalinkUrl = hash ? permalinkUrlFromHash(hash) : undefined
    return buildFromImages(client, snapshot.entities.images, snapshot.uuid, sourcePermalinkUrl)
}
