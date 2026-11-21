import type { ImageWithEmbedded, List } from "@phylopic/api-models"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"

/** All images registered on a PhyloPic collection (API), with specific nodes embedded. */
export const loadCollectionImages = async (
    client: PhyloPicClient,
    collectionUuid: string,
): Promise<readonly ImageWithEmbedded[]> => {
    const list = await client.getJson<List>("/images", { filter_collection: collectionUuid })
    const totalPages = list.totalPages
    const images: ImageWithEmbedded[] = []
    for (let page = 0; page < totalPages; page++) {
        const pageData = await client.getJson<{ _embedded?: { items?: readonly ImageWithEmbedded[] } }>("/images", {
            filter_collection: collectionUuid,
            page,
            embed_items: "true",
            embed_specificNode: "true",
        })
        images.push(...(pageData._embedded?.items ?? []))
    }
    return images
}
