import { isImageWithEmbedded, type ImageWithEmbedded, type List } from "@phylopic/api-models"
import { Query, extractQueryString, parseQueryString } from "@phylopic/utils"
import { createIndexSet } from "./createIndexSet"
import { getItemByIndex } from "./getItemByIndex"
import { pickRandomMember } from "./pickRandomMember"
export async function pickRandomImage(
    list: Pick<List, "_links" | "itemsPerPage" | "totalItems">,
    criterion: (node: ImageWithEmbedded) => Promise<boolean>,
    query: Query,
) {
    const candidates = createIndexSet(list.totalItems)
    while (candidates.size) {
        const index = pickRandomMember(candidates)
        if (index === null) {
            return null
        }
        const item = await getItemByIndex<ImageWithEmbedded>(index, list, isImageWithEmbedded, {
            ...parseQueryString(extractQueryString(list._links.self.href)),
            ...query,
        })
        if (await criterion(item)) {
            return item
        }
        candidates.delete(index)
    }
    return null
}
