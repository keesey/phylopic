import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import is4xxError from "~/http/is4xxError"
import useAuthToken from "./useAuthToken"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig<void>, "method" | "url"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedExistenceFetcher = (config?: AuthorizedJSONFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (key: { url: string; method: "HEAD" }) => {
            try {
                const response = await axios({
                    ...config,
                    headers: token ? { ...config?.headers, authorization: `Bearer ${token}` } : config?.headers,
                    method: "HEAD",
                    url: key.url,
                })
                return response.status >= 200 && response.status < 300
            } catch (e) {
                if (is4xxError(e)) {
                    return false
                }
                throw e
            }
        },
        [config, token],
    )
}
export default useAuthorizedExistenceFetcher
