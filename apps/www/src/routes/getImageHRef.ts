import { TitledLink } from "@phylopic/api-models"
import extractUUIDv4 from "./extractUUIDv4"
import getImageSlug from "./getImageSlug"
const getImageHRef = (link: TitledLink) => {
    const uuid = extractUUIDv4(link.href)
    if (!uuid) {
        return "/images"
    }
    return `/images/${encodeURIComponent(uuid)}/${encodeURIComponent(getImageSlug(link.title))}`
}
export default getImageHRef
