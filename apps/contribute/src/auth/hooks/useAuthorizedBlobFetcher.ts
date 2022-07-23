import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
export type AuthorizedBlobFetcherConfig = Omit<AxiosRequestConfig, "responseType"> & {
    headers: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedBlogFetcher = (config?: AuthorizedBlobFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (url: string) => {
            const response = await axios.get<Blob>(url, {
                ...config,
                headers: token ? { ...config?.headers, authorization: `Bearer ${token}` } : config?.headers,
                responseType: "blob",
            })
            return response.data
        },
        [config, token],
    )
}
export default useAuthorizedBlogFetcher
