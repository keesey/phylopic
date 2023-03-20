import slugify from "slugify"
const getContributorSlug = (title: string) => `silhouettes-by-${slugify(title)}`
export default getContributorSlug
