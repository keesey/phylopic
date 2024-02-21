import { type AceBase } from "acebase"
import axios, { type AxiosRequestConfig } from "axios"
import { type PromisyClass, type TaskQueue } from "cwait"
import md5 from "md5"
const getAPIResult = async <R, D = unknown>(
    url: string,
    config: AxiosRequestConfig<D> | undefined = undefined,
    ttl: number,
    database: AceBase,
    queue: TaskQueue<Promise<R> & PromisyClass>,
): Promise<R> => {
    const now = new Date().valueOf()
    const ref = database.ref<{ data: R; expiry: number }>(md5(url))
    const snapshot = await ref.get()
    if (snapshot.exists()) {
        const value = snapshot.val()
        if (value && value.expiry > now) {
            return value.data
        }
    }
    const response = await queue.wrap(() => axios.get<R>(url, config))()
    await ref.set({
        data: response.data,
        expiry: now + ttl,
    })
    return response.data
}
export default getAPIResult
