import { isPageWithEmbedded, type List, type PageWithEmbedded } from "@phylopic/api-models"
import {
    createSearch,
    extractPath,
    extractQueryString,
    parseQueryString,
    type FaultDetector,
    type Query,
} from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export async function getItemByIndex<T>(
    index: number,
    list: Pick<List, "_links" | "itemsPerPage">,
    detector: FaultDetector<T>,
    itemQuery: Query,
) {
    const listHRef = list._links.self.href
    const pageIndex = Math.floor(index / list.itemsPerPage)
    const { data: page } = await fetchDataAndCheck<PageWithEmbedded<T>>(
        `${process.env.NEXT_PUBLIC_API_URL}${extractPath(listHRef)}${createSearch({
            ...parseQueryString(extractQueryString(listHRef)),
            ...itemQuery,
            embed_items: "true",
            page: pageIndex,
        })}`,
        {},
        isPageWithEmbedded(detector),
    )
    const item = page._embedded.items?.[index - pageIndex * list.itemsPerPage]
    if (!item) {
        throw new Error(`Unexpected condition for index #${index} in list: ${listHRef}, page ${pageIndex}`)
    }
    return item
}
