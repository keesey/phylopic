import { isImageWithEmbedded, type ImageWithEmbedded, type List } from "@phylopic/api-models"
import { Query, extractQueryString, parseQueryString } from "@phylopic/utils"
import { createIndexSet } from "../utils/createIndexSet"
import { getListItemByIndex } from "./getListItemByIndex"
import { pickRandomMember } from "../utils/pickRandomMember"
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
        const item = await getListItemByIndex<ImageWithEmbedded>(index, list, isImageWithEmbedded, {
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
