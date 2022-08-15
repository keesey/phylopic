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
            if (!token) {
                throw new Error("Unauthorized.")
            }
            const response = await axios({
                method: "GET",
                ...config,
                headers: { ...config?.headers, authorization: `Bearer ${token}` },
                responseType: "json",
                url,
            })
            return response.data as T
        },
        [config, token],
    )
}
export default useAuthorizedJSONFetcher
