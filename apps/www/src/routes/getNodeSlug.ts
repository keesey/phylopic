import slugify from "slugify"
const getNodeSlug = (title: string) => `${slugify(title)}-silhouettes`
export default getNodeSlug
