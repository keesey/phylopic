import { AxiosRequestConfig, Method } from "axios"
import { useMemo } from "react"
import { CurlOptions } from "./CurlOptions"
const useCommandKey = (url: string, options?: CurlOptions): AxiosRequestConfig => {
    return useMemo(() => {
        let method: Method = "GET"
        if (options?.data) {
            method = "POST"
        }
        const config: AxiosRequestConfig = {
            data: options?.data,
            headers: options?.headers,
            method,
            url,
            maxRedirects: options?.location ? undefined : 0,
        }
        return config
    }, [options?.data, options?.headers, options?.location, url])
}
export default useCommandKey
