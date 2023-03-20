import slugify from "slugify"
const getImageSlug = (title: string) => slugify(title, { lower: true })
export default getImageSlug
