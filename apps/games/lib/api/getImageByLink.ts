import { ImageWithEmbedded, Link, isImageWithEmbedded } from "@phylopic/api-models"
import { Query, createSearch, extractPath, extractQueryString, parseQueryString } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const getImageByLink = async (link: Pick<Link, "href"> | null, query: Query) => {
    if (!link) {
        return null
    }
    const { data: node } = await fetchDataAndCheck<ImageWithEmbedded>(
        `${process.env.NEXT_PUBLIC_API_URL}${extractPath(link.href)}${createSearch({
            ...parseQueryString(extractQueryString(link.href)),
            ...query,
        })}`,
        {},
        isImageWithEmbedded,
    )
    return node
}
