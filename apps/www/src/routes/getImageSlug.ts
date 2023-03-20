import slugify from "slugify"
const getImageSlug = (title: string) => slugify(title, { lower: true, strict: true, trim: true })
export default getImageSlug
