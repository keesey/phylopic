import axios, { AxiosRequestHeaders } from "axios"
import { useCallback, useContext } from "react"
import AuthContext from "../AuthContext"
const useFetcher = <T>(headers?: Omit<AxiosRequestHeaders, "authorization">) => {
    const [token] = useContext(AuthContext) ?? []
    return useCallback(
        (url: string) =>
            axios.get<T>(url, {
                headers: token ? { ...headers, authorization: `Bearer ${token}` } : headers,
            }),
        [headers, token],
    )
}
export default useFetcher
