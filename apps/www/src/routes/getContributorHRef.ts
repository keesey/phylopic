import { TitledLink } from "@phylopic/api-models"
import { extractUUIDv4 } from "@phylopic/utils"
import getContributorSlug from "./getContributorSlug"
const getContributorHRef = (link: TitledLink) => {
    const uuid = extractUUIDv4(link.href)
    if (!uuid) {
        return "/contributors"
    }
    return `/contributors/${encodeURIComponent(uuid)}/${encodeURIComponent(getContributorSlug(link.title))}`
}
export default getContributorHRef
