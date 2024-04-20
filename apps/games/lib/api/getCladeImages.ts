import { List, Node, isList } from "@phylopic/api-models"
import { Query, createSearch, extractPath, extractQueryString, parseQueryString } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export async function getCladeImages(node: Pick<Node, "_links">, query?: Query) {
    if (!node._links.cladeImages) {
        return null
    }
    const { data: list } = await fetchDataAndCheck<List>(
        `${process.env.NEXT_PUBLIC_API_URL}${extractPath(node._links.cladeImages.href)}${createSearch({
            ...parseQueryString(extractQueryString(node._links.cladeImages.href)),
            ...query,
        })}`,
        {},
        isList,
    )
    return list
}
