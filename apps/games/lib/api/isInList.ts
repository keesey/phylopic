import { Entity, List, Page, isPage } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const isInList = async (item: Pick<Entity, "_links" | "uuid">, list: Pick<List, "_links">) => {
    let pageLink = list._links.firstPage
    while (pageLink) {
        const { data: page } = await fetchDataAndCheck<Page>(
            `${process.env.NEXT_PUBLIC_API_URL}${pageLink.href}`,
            {},
            isPage,
        )
        if (page._links.items.some(itemLink => itemLink.href === item._links.self.href)) {
            return true
        }
        pageLink = page._links.next
    }
    return false
}
