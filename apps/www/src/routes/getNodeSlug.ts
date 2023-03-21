import slugify from "slugify"
const getNodeSlug = (title?: string) => `${slugify(title ?? "[Unnamed]", { lower: true, strict: true, trim: true })}-silhouettes`
export default getNodeSlug
