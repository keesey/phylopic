import { Contributor } from "@phylopic/api-models"
const getContributorName = (value?: Contributor) => value?.name || "Anonymous"
export default getContributorName
