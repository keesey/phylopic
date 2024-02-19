import TIMETREE_API_URL from "./TIMETREE_API_URL.js"
const getAgeUrl = (ncbiTaxIds: readonly string[]) =>
    `${TIMETREE_API_URL}/mrca/id/${encodeURIComponent(ncbiTaxIds.join(" "))}/age`
export default getAgeUrl
