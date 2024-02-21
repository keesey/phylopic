import { type AceBase } from "acebase"
import { type PromisyClass, type TaskQueue } from "cwait"
import getAPIResult from "../getAPIResult.js"
import { type PBDBStrataResponse } from "./PBDBStrataResponse"
import getStrataUrl from "./getStrataUrl.js"
const getAge = async (
    pbdbTxnIds: Iterable<string>,
    database: AceBase,
    queue: TaskQueue<Promise<PBDBStrataResponse> & PromisyClass>,
) => {
    const data = await getAPIResult(
        getStrataUrl(Array.from(pbdbTxnIds).sort()),
        undefined,
        30 * 24 * 60 * 60 * 1000,
        database,
        queue,
    )
    if (!data?.records?.length) {
        return null
    }
    return [
        Math.max(...data.records.map(record => record.eag)) * 1000000,
        Math.min(...data.records.map(record => record.lag)) * 1000000,
    ]
}
export default getAge
