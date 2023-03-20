import slugify from "slugify"
const getImageSlug = (title: string) => slugify(title)
export default getImageSlug
