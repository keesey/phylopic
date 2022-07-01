import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig, "responseType"> & {
    headers: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedJSONFetcher = <T>(config?: AuthorizedJSONFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (url: string) => {
            const response = await axios.get<T>(url, {
                ...config,
                headers: token ? { ...config?.headers, authorization: `Bearer ${token}` } : config?.headers,
                responseType: "json",
            })
            return response.data
        },
        [config, token],
    )
}
export default useAuthorizedJSONFetcher
