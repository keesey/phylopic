import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig, "responseType"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedJSONFetcher = <T>() => {
    const token = useAuthToken()
    return useCallback(
        async (key: string | AuthorizedJSONFetcherConfig) => {
            if (!token) {
                throw new Error("Unauthorized.")
            }
            const config: AxiosRequestConfig = typeof key === "string" ? { url: key } : key
            console.debug({
                method: "GET",
                ...config,
                headers: { ...config?.headers, authorization: `Bearer ${token}` },
                responseType: "json",
            })
            const response = await axios({
                method: "GET",
                ...config,
                headers: { ...config?.headers, authorization: `Bearer ${token}` },
                responseType: "json",
            })
            return response.data as T
        },
        [token],
    )
}
export default useAuthorizedJSONFetcher
