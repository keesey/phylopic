import axios from "axios"
import { PBDBTaxonResponse } from "./PBDBTaxonResponse"
import getTaxonUrl from "./getTaxonUrl"
const getIsExtant = async (pbdbTxnIds: Iterable<string>) => {
    const results = await Promise.all(
        Array.from(pbdbTxnIds).map(async txnId => {
            const response = await axios.get<PBDBTaxonResponse>(getTaxonUrl(txnId))
            return response.data.records.some(record => record.ext === "1")
        }),
    )
    return results.includes(true)
}
export default getIsExtant
