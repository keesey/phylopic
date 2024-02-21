import { type AceBase } from "acebase"
import { type PromisyClass, type TaskQueue } from "cwait"
import getAPIResult from "../getAPIResult.js"
import { type PBDBTaxonResponse } from "./PBDBTaxonResponse"
import getTaxonUrl from "./getTaxonUrl.js"
const getIsExtant = async (
    pbdbTxnIds: Iterable<string>,
    database: AceBase,
    queue: TaskQueue<Promise<PBDBTaxonResponse> & PromisyClass>,
) => {
    const results = await Promise.all(
        Array.from(pbdbTxnIds).map(async txnId => {
            const data = await getAPIResult(
                getTaxonUrl(txnId),
                undefined,
                365 * 30 * 24 * 60 * 50 * 1000,
                database,
                queue,
            )
            return data.records.some(record => record.ext === "1")
        }),
    )
    return results.includes(true)
}
export default getIsExtant
