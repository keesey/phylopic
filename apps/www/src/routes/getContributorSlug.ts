import slugify from "slugify"
const getContributorSlug = (title: string) => `silhouettes-by-${slugify(title, { lower: true })}`
export default getContributorSlug
