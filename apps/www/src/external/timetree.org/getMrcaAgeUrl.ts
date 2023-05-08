import TIMETREE_API_URL from "./TIMETREE_API_URL"
const getMrcaAgeUrl = (ncbiTaxIds: readonly string[]) =>
    TIMETREE_API_URL + "/mrca/id/" + ncbiTaxIds.map(value => encodeURIComponent(value)).join("+") + "/age"
export default getMrcaAgeUrl
