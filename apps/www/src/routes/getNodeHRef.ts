import { TitledLink } from "@phylopic/api-models"
import extractUUIDv4 from "./extractUUIDv4"
import getNodeSlug from "./getNodeSlug"
const getNodeHRef = (link: TitledLink) => {
    const uuid = extractUUIDv4(link.href)
    if (!uuid) {
        return "/nodes"
    }
    return `/nodes/${encodeURIComponent(uuid)}/${encodeURIComponent(getNodeSlug(link.title))}`
}
export default getNodeHRef
