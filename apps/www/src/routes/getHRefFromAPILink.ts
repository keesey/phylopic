import { TitledLink } from "@phylopic/api-models"
import { extractPath } from "@phylopic/utils"
import getSlug from "./getSlug"
const getHRefFromAPILink = (link: TitledLink) => {
    const path = extractPath(link.href)
    return path + "/" + encodeURIComponent(getSlug(path, link.title))
}
export default getHRefFromAPILink
