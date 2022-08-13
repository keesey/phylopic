import { useCallback, useMemo } from "react"
import useAuthToken from "./useAuthToken"
import axios, { AxiosRequestConfig } from "axios"
export type AuthorizedImgSrcFetcherConfig = Omit<AxiosRequestConfig, "method" | "responseType" | "url"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedImgSrcFetcher = (config?: AuthorizedImgSrcFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (url: string): Promise<string> => {
            const response = await axios({
                method: "GET",
                ...config,
                headers: token ? { ...config?.headers, authorization: `Bearer ${token}` } : config?.headers,
                responseType: "blob",
                url,
            })
            return URL.createObjectURL(response.data as Blob)
        },
        [config, token],
    )
}
export default useAuthorizedImgSrcFetcher
