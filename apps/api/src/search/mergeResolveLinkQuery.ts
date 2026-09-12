import { TitledLink } from "@phylopic/api-models"
import { createSearch, extractQueryString, parseQueryString, Query, stringifyNormalized } from "@phylopic/utils"

const mergeResolveLinkQuery = (body: string, queryParameters: Query): string => {
    const link = JSON.parse(body) as TitledLink
    const [path] = link.href.split("?", 1)
    const mergedQuery = {
        ...parseQueryString(extractQueryString(link.href)),
        ...queryParameters,
    }
    return stringifyNormalized({
        ...link,
        href: path + createSearch(mergedQuery),
    })
}

export default mergeResolveLinkQuery
