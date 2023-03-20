import slugify from "slugify"
import getContributorSlug from "./getContributorSlug"
import getImageSlug from "./getImageSlug"
import getNodeSlug from "./getNodeSlug"
const getSlug = (href: string, title: string) => {
    if (href.startsWith("/images/")) {
        return getImageSlug(title)
    }
    if (href.startsWith("/nodes/")) {
        return getNodeSlug(title)
    }
    if (href.startsWith("/contributors/")) {
        return getContributorSlug(title)
    }
    return slugify(title, { lower: true })
}
export default getSlug
