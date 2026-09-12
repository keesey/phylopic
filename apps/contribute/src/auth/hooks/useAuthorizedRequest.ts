import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { useCallback } from "react"
import useAuthToken from "./useAuthToken"
import useDeauthorize from "./useDeauthorize"
const useAuthorizedRequest = () => {
    const token = useAuthToken()
    const deauthorize = useDeauthorize()
    return useCallback(
        async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
            if (!token) {
                throw new Error("Unauthorized.")
            }
            try {
                return await axios({
                    method: "GET",
                    ...config,
                    headers: { ...config.headers, authorization: `Bearer ${token}` },
                })
            } catch (e) {
                // 403 means the token is valid but the resource belongs to someone else,
                // so only a 401 should discard it.
                if (axios.isAxiosError(e) && e.response?.status === 401) {
                    await deauthorize()
                }
                throw e
            }
        },
        [deauthorize, token],
    )
}
export default useAuthorizedRequest
