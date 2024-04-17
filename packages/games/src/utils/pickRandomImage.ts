import { type ImageWithEmbedded, isImageWithEmbedded, type List } from "@phylopic/api-models"
import { createIndexSet } from "./createIndexSet"
import { getItemByIndex } from "./getItemByIndex"
import { pickRandomMember } from "./pickRandomMember"
export async function pickRandomImage(
    list: Pick<List, "_links" | "itemsPerPage" | "totalItems">,
    criterion?: (node: ImageWithEmbedded) => Promise<boolean>,
    build?: number,
) {
    const candidates = createIndexSet(list.totalItems)
    while (candidates.size) {
        const index = pickRandomMember(candidates)
        if (index === null) {
            return null
        }
        const item = await getItemByIndex<ImageWithEmbedded>(index, list, isImageWithEmbedded, {
            build,
            embed_specificNode: "true",
        })
        if (!criterion || (await criterion(item))) {
            return item
        }
        candidates.delete(index)
    }
    return null
}
