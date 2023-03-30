import { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios"
import { useMemo } from "react"
import { CurlOptions } from "./CurlOptions"
const useCommandKey = (url: string, options?: CurlOptions): AxiosRequestConfig => {
    return useMemo(() => {
        let headers: AxiosRequestHeaders | undefined
        let method: Method | undefined
        if (options?.data) {
            method = "POST"
        }
        const config: AxiosRequestConfig = {
            data: options?.data,
            headers,
            method,
            url,
        }
        return config
    }, [options?.data, url])
}
export default useCommandKey
