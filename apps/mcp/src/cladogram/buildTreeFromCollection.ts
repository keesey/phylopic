import type { ImageWithEmbedded } from "@phylopic/api-models"
import { buildCollectionCladogramTree, type LineageFetcher } from "@phylopic/diagrams"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import {
    fetchPermalinkCollectionSnapshot,
    permalinkUrlFromHash,
    parsePermalinkHash,
    type CollectionPermalinkSnapshot,
} from "../collection/collectionPermalink.js"
import { loadCollectionImages } from "../collection/loadCollectionImages.js"
import type { BuildTreeFromTerminalsResult, TerminalTaxon } from "./buildTreeFromTerminals.js"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"

export type BuildTreeFromCollectionResult = BuildTreeFromTerminalsResult &
    Readonly<{
        sourceCollectionUuid: string
        sourcePermalinkUrl?: string
        imageUuidByTreeId: Readonly<Record<string, string>>
        imageUuids: readonly string[]
    }>

const lineageFetcher = (client: PhyloPicClient): LineageFetcher => (nodeUuid, page) =>
    client.getJson(`/nodes/${nodeUuid}/lineage`, {
        embed_items: "true",
        page,
    })

const fromBuilt = (
    built: Awaited<ReturnType<typeof buildCollectionCladogramTree>>,
    sourceCollectionUuid: string,
    sourcePermalinkUrl?: string,
): BuildTreeFromCollectionResult => ({
    tree: built.tree,
    newick: cladogramTreeToNewick(built.tree.root),
    nodeUuidByTreeId: built.nodeUuidByTreeId,
    terminals: built.terminals as readonly TerminalTaxon[],
    warnings: built.warnings,
    sourceCollectionUuid,
    sourcePermalinkUrl,
    imageUuidByTreeId: built.imageUuidByTreeId,
    imageUuids: [...new Set(Object.values(built.imageUuidByTreeId))],
})

export const buildTreeFromCollectionUuid = async (
    client: PhyloPicClient,
    collectionUuid: string,
): Promise<BuildTreeFromCollectionResult> => {
    const images = await loadCollectionImages(client, collectionUuid)
    if (!images.length) {
        throw new Error(`Collection ${collectionUuid} has no images.`)
    }
    const built = await buildCollectionCladogramTree(images, lineageFetcher(client))
    return fromBuilt(built, collectionUuid)
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
    const built = await buildCollectionCladogramTree(snapshot.entities.images, lineageFetcher(client))
    return fromBuilt(built, snapshot.uuid, sourcePermalinkUrl)
}
