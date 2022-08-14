import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import isNotFoundError from "~/http/isNotFoundError"
import useAuthToken from "./useAuthToken"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig<void>, "method" | "url"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedExistenceFetcher = (config?: AuthorizedJSONFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (key: { url: string; method: "HEAD" }) => {
            if (!token) {
                throw new Error("Unauthorized.")
            }
            try {
                const response = await axios({
                    ...config,
                    headers: { ...config?.headers, authorization: `Bearer ${token}` },
                    method: "HEAD",
                    url: key.url,
                })
                return response.status >= 200 && response.status < 300
            } catch (e) {
                if (isNotFoundError(e)) {
                    return false
                }
                throw e
            }
        },
        [config, token],
    )
}
export default useAuthorizedExistenceFetcher
