import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig, "responseType" | "url"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedJSONFetcher = <T>(config?: AuthorizedJSONFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (url: string) => {
            const response = await axios({
                method: "GET",
                ...config,
                headers: token ? { ...config?.headers, authorization: `Bearer ${token}` } : config?.headers,
                responseType: "json",
                url,
            })
            return response.data
        },
        [config, token],
    )
}
export default useAuthorizedJSONFetcher
