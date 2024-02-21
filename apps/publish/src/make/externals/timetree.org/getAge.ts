import { type AceBase } from "acebase"
import { type PromisyClass, type TaskQueue } from "cwait"
import fetchField from "./fetchField.js"
import getAgeUrl from "./getAgeUrl.js"
const getAge = async (
    ncbiTaxIDs: Iterable<string>,
    database: AceBase,
    queue: TaskQueue<Promise<ArrayBuffer> & PromisyClass>,
) => {
    const result = await fetchField(
        getAgeUrl(Array.from(ncbiTaxIDs).sort()),
        3 * 30 * 24 * 60 * 60 * 1000,
        database,
        queue,
    )
    if (typeof result === "string") {
        const n = parseFloat(result)
        if (isFinite(n)) {
            return Math.max(0, n) * 1000000
        }
    }
    return null
}
export default getAge
