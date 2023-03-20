import slugify from "slugify"
const getNodeSlug = (title: string) => `${slugify(title, { lower: true })}-silhouettes`
export default getNodeSlug
