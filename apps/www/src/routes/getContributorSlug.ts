import slugify from "slugify"
const getContributorSlug = (title?: string) =>
    `${slugify(title ?? "[Anonymous]", { lower: true, strict: true, trim: true })}-silhouettes`
export default getContributorSlug
