import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import isNotFoundError from "~/http/isNotFoundError"
import useAuthToken from "./useAuthToken"
export type AuthorizedExistenceKey = Omit<AxiosRequestConfig<void>, "method"> & {
    headers?: Omit<AxiosRequestConfig["headers"], "authorization">
    method: "HEAD"
}
const useAuthorizedExistenceFetcher = () => {
    const token = useAuthToken()
    return useCallback(
        async (key: AuthorizedExistenceKey) => {
            if (!token) {
                throw new Error("Unauthorized.")
            }
            try {
                const response = await axios({
                    headers: { ...key.headers, authorization: `Bearer ${token}` },
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
        [token],
    )
}
export default useAuthorizedExistenceFetcher
