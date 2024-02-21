import { type AceBase } from "acebase"
import { type PromisyClass, type TaskQueue } from "cwait"
import getAPIResult from "../getAPIResult.js"
const arrayBufferToString = (buffer: ArrayBufferLike | ArrayLike<number>) =>
    String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer).values()))
const fetchField = async (
    url: string,
    ttl: number,
    database: AceBase,
    queue: TaskQueue<Promise<ArrayBuffer> & PromisyClass>,
): Promise<string | null> => {
    try {
        const data = await getAPIResult<ArrayBuffer>(url, { responseType: "arraybuffer" }, ttl, database, queue)
        const text = arrayBufferToString(data)
        const [, value] = text.split(":", 2)
        return value.trim() || null
    } catch (e) {
        console.warn(e)
        throw e
    }
}
export default fetchField
