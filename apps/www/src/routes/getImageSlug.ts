import slugify from "slugify"
const getImageSlug = (title?: string) => slugify(title ?? "[Untitled]", { lower: true, strict: true, trim: true })
export default getImageSlug
