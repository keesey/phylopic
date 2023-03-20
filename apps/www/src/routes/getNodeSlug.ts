import slugify from "slugify"
const getNodeSlug = (title: string) => `${slugify(title, { lower: true, strict: true, trim: true })}-silhouettes`
export default getNodeSlug
