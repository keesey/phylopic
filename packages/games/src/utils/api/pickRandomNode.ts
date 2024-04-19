import { type NodeWithEmbedded, isNodeWithEmbedded, type List } from "@phylopic/api-models"
import { createIndexSet } from "../core/createIndexSet"
import { getListItemByIndex } from "./getListItemByIndex"
import { pickRandomMember } from "../core/pickRandomMember"
import { extractQueryString, parseQueryString } from "@phylopic/utils"
export async function pickRandomNode(
    list: Pick<List, "_links" | "itemsPerPage" | "totalItems">,
    criterion?: (node: NodeWithEmbedded) => Promise<boolean>,
) {
    const candidates = createIndexSet(list.totalItems)
    while (candidates.size) {
        const index = pickRandomMember(candidates)
        if (index === null) {
            return null
        }
        const item = await getListItemByIndex<NodeWithEmbedded>(index, list, isNodeWithEmbedded, {
            ...parseQueryString(extractQueryString(list._links.self.href)),
            embed_childNodes: "true",
            embed_parentNode: "true",
            embed_primaryImage: "true",
        })
        if (!criterion || (await criterion(item))) {
            return item
        }
        candidates.delete(index)
    }
    return null
}
