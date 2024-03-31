import PALEOBIODB_API_URL from "./PALEOBIODB_API_URL"
const getStrataUrl = (pbdbTxnIds: readonly string[]) =>
    `${PALEOBIODB_API_URL}/occs/strata.json?taxon_id=${encodeURIComponent(pbdbTxnIds.join(","))}`
export default getStrataUrl
