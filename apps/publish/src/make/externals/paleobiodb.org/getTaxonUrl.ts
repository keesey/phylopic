import PALEOBIODB_API_URL from "./PALEOBIODB_API_URL"
const getTaxonUrl = (pbdbTxnId: string) => `${PALEOBIODB_API_URL}/taxa/single.json?id=${encodeURIComponent(pbdbTxnId)}`
export default getTaxonUrl
