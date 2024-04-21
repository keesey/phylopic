import { Link, NodeWithEmbedded, isNodeWithEmbedded } from "@phylopic/api-models"
import { Query, createSearch, extractPath, extractQueryString, parseQueryString } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const getNodeByLink = async (link: Link | null, query: Query) => {
    if (!link) {
        return null
    }
    const { data: node } = await fetchDataAndCheck<NodeWithEmbedded>(
        `${process.env.NEXT_PUBLIC_API_URL}${extractPath(link.href)}${createSearch({
            ...parseQueryString(extractQueryString(link.href)),
            ...query,
        })}`,
        {},
        isNodeWithEmbedded,
    )
    return node
}
