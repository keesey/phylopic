import { List, Node, isList } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
// :TODO: Allow license filters
export async function getCladeImages(node: Pick<Node, "_links">) {
    if (!node._links.cladeImages) {
        return null
    }
    const { data: list } = await fetchDataAndCheck<List>(
        `${process.env.NEXT_PUBLIC_API_URL}${node._links.cladeImages.href}`,
        {},
        isList,
    )
    return list
}
