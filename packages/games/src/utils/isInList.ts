import { Entity, List, Page, isPage } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const isInList = async (item: Entity, list: List) => {
    let pageLink = list._links.firstPage?.href
    while (pageLink) {
        const { data: page } = await fetchDataAndCheck<Page>(
            `${process.env.NEXT_PUBLIC_API_URL}${pageLink}`,
            {},
            isPage,
        )
        if (page._links.items.some(itemLink => itemLink.href === item._links.self.href)) {
            return true
        }
        pageLink = page._links.next?.href
    }
    return false
}
