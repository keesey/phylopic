import { Link, NodeWithEmbedded, isNodeWithEmbedded } from "@phylopic/api-models"
import { createSearch, extractPath, extractQueryString, parseQueryString } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const getNodeByLink = async (link: Link | null) => {
    if (!link) {
        return null
    }
    const { data: node } = await fetchDataAndCheck<NodeWithEmbedded>(
        `${process.env.NEXT_PUBLIC_API_URL}${extractPath(link.href)}${createSearch({
            ...parseQueryString(extractQueryString(link.href)),
            embed_childNodes: "true",
            embed_parentNode: "true",
            embed_primaryImage: "true",
        })}`,
        {},
        isNodeWithEmbedded,
    )
    return node
}
