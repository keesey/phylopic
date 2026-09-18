import {
    type Collection,
    type Contributor,
    type ImageWithEmbedded,
    isCollection,
    type List,
    type NodeWithEmbedded,
    type PageWithEmbedded,
} from "@phylopic/api-models"
import { createSearch, EMPTY_UUID, normalizeUUID, type UUIDish } from "@phylopic/utils"
import axios from "axios"
import type { CollectionPermalinkData } from "../types/CollectionPermalinkData"
const loadList = async <T>(
    endpoint: string,
    build: number,
    uuid: UUIDish,
    embedsQuery?: Record<string, "true">,
): Promise<readonly T[]> => {
    const listResponse = await axios.get<List>(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${createSearch({ build, filter_collection: uuid })}`,
    )
    let items: T[] = []
    for (let page = 0; page < listResponse.data.totalPages; ++page) {
        const pageResponse = await axios.get<PageWithEmbedded<T>>(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${createSearch({
                ...(embedsQuery ? { ...embedsQuery, embed_items: "true" } : {}),
                build,
                filter_collection: uuid,
                page,
            })}`,
        )
        items = [...items, ...(pageResponse.data._embedded.items ?? [])]
    }
    return items
}
const checkCollectionExistence = async (uuid: UUIDish): Promise<void> => {
    const collectionResponse = await axios.get<Collection>(
        `${process.env.NEXT_PUBLIC_API_URL}/collections/${encodeURIComponent(normalizeUUID(uuid))}`,
    )
    if (collectionResponse.status >= 400) {
        throw collectionResponse.status
    }
    if (!isCollection(collectionResponse.data)) {
        throw new Error("Invalid collection.")
    }
}
const loadCollection = async (uuid: UUIDish, build: number): Promise<CollectionPermalinkData> => {
    if (uuid === EMPTY_UUID) {
        return {
            entities: {
                contributors: [],
                images: [],
                nodes: [],
            },
            type: "collection",
            uuid,
        }
    }
    await checkCollectionExistence(uuid)
    return {
        entities: {
            contributors: await loadList<Contributor>("/contributors", build, uuid),
            nodes: await loadList<NodeWithEmbedded>("/nodes", build, uuid, { embed_primaryImage: "true" }),
            images: await loadList<ImageWithEmbedded>("/images", build, uuid, { embed_specificNode: "true" }),
        },
        type: "collection",
        uuid,
    }
}
export default loadCollection
