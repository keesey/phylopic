import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
export type AuthorizedImgSrcFetcherConfig = Omit<AxiosRequestConfig, "responseType" | "url"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedImgSrcFetcher = (config?: AuthorizedImgSrcFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (url: string): Promise<string> => {
            if (!token) {
                throw new Error("Unauthorized.")
            }
            const response = await axios({
                method: "GET",
                ...config,
                headers: { ...config?.headers, authorization: `Bearer ${token}` },
                responseType: "blob",
                url,
            })
            return URL.createObjectURL(response.data as Blob)
        },
        [config, token],
    )
}
export default useAuthorizedImgSrcFetcher
