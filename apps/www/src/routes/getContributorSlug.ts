import slugify from "slugify"
const getContributorSlug = (title: string) => `${slugify(title, { lower: true, strict: true, trim: true })}-silhouettes`
export default getContributorSlug
