import axios from "axios"
import { PBDBStrataResponse } from "./PBDBStrataResponse"
import getStrataUrl from "./getStrataUrl.js"
const getAge = async (pbdbTxnIds: Iterable<string>) => {
    const url = getStrataUrl(Array.from(pbdbTxnIds).sort())
    const response = await axios.get<PBDBStrataResponse>(url)
    if (!response.data?.records?.length) {
        return null
    }
    return [
        Math.max(...response.data.records.map(record => record.eag)) * 1000000,
        Math.min(...response.data.records.map(record => record.lag)) * 1000000,
    ]
}
export default getAge
