import { type NodeWithEmbedded, isNodeWithEmbedded, type List } from "@phylopic/api-models"
import { createIndexSet } from "./createIndexSet"
import { getItemByIndex } from "./getItemByIndex"
import { pickRandomMember } from "./pickRandomMember"
export async function pickRandomNode(
    list: Pick<List, "_links" | "itemsPerPage" | "totalItems">,
    criterion?: (node: NodeWithEmbedded) => Promise<boolean>,
    build?: number,
) {
    const candidates = createIndexSet(list.totalItems)
    while (candidates.size) {
        const index = pickRandomMember(candidates)
        if (index === null) {
            return null
        }
        const item = await getItemByIndex<NodeWithEmbedded>(index, list, isNodeWithEmbedded, {
            build,
            embed_childNodes: "true",
            embed_parentNode: "true",
        })
        if (!criterion || (await criterion(item))) {
            return item
        }
        candidates.delete(index)
    }
    return null
}