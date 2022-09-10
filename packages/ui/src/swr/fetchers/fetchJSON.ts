import axios, { AxiosRequestConfig } from "axios"
export type JSONFetcherConfig = Omit<AxiosRequestConfig, "responseType">
export const fetchJSON = async <T>(key: string | JSONFetcherConfig) => {
    const config: JSONFetcherConfig = typeof key === "string" ? { method: "GET", url: key } : key
    const response = await axios({
        ...config,
        responseType: "json",
    })
    return response.data as T
}
export default fetchJSON
