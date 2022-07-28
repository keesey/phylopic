import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
export type AuthorizedJSONFetcherConfig = Omit<AxiosRequestConfig<void>, "url"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
}
const useAuthorizedExistenceFetcher = (config?: AuthorizedJSONFetcherConfig) => {
    const token = useAuthToken()
    return useCallback(
        async (url: string) => {
            try {
                const response = await axios({
                    method: "HEAD",
                    ...config,
                    headers: token ? { ...config?.headers, authorization: `Bearer ${token}` } : config?.headers,
                    url,
                })
                return response.status >= 200 && response.status < 400
            } catch (e) {
                if (axios.isAxiosError(e) && typeof e.response?.status === "number" && e.response.status < 500) {
                    return false
                }
                throw e
            }
        },
        [config, token],
    )
}
export default useAuthorizedExistenceFetcher
