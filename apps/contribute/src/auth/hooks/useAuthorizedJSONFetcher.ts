import { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthorizedRequest from "./useAuthorizedRequest"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig, "responseType"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedJSONFetcher = <T>() => {
    const request = useAuthorizedRequest()
    return useCallback(
        async (key: string | AuthorizedJSONFetcherConfig) => {
            const config: AxiosRequestConfig = typeof key === "string" ? { url: key } : key
            const response = await request({ ...config, responseType: "json" })
            return response.data as T
        },
        [request],
    )
}
export default useAuthorizedJSONFetcher
