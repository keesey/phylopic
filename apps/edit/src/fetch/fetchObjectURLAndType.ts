import axios, { AxiosRequestConfig } from "axios"
export type ObjectURLFetcherConfig = Omit<AxiosRequestConfig, "responseType">
const fetchObjectURLAndType = async <T>(key: string | ObjectURLFetcherConfig) => {
    const config: ObjectURLFetcherConfig = typeof key === "string" ? { method: "GET", url: key } : key
    const response = await axios({
        method: "GET",
        ...config,
        responseType: "blob",
    })
    return {
        type: response.headers["content-type"],
        url: URL.createObjectURL(response.data as Blob),
    }
}
export default fetchObjectURLAndType
