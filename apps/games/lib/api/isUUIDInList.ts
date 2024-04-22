import { List, Page, isPage } from "@phylopic/api-models"
import { UUID, extractPath, isUUIDv4 } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
const extractUUID = (href: string): UUID | null => {
    const path = extractPath(href)
    const uuid = path.split("/").pop()
    return isUUIDv4(uuid) ? uuid : null
}
export const isUUIDInList = async (uuid: UUID, list: Pick<List, "_links">) => {
    let pageLink = list._links.firstPage
    while (pageLink) {
        const { data: page } = await fetchDataAndCheck<Page>(
            `${process.env.NEXT_PUBLIC_API_URL}${pageLink.href}`,
            {},
            isPage,
        )
        if (page._links.items.some(itemLink => extractUUID(itemLink.href) === uuid)) {
            return true
        }
        pageLink = page._links.next
    }
    return false
}
