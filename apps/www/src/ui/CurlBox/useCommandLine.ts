import { useMemo } from "react"
import { CurlOptions } from "./CurlOptions"
const useCommandLine = (url: string, options?: CurlOptions) => {
    return useMemo(() => {
        let line = "curl "
        if (typeof options?.data !== "undefined") {
            line += `--data ${JSON.stringify(JSON.stringify(options.data))} `
        }
        if (options?.headers) {
            const keys = Object.keys(options.headers).sort()
            for (const key of keys) {
                line += `--header ${JSON.stringify(`${key}: ${options.headers[key]}`)} `
            }
        }
        if (options?.location) {
            line += "--location "
        }
        line += JSON.stringify(url)
        return line
    }, [options?.data, options?.headers, options?.location, url])
}
export default useCommandLine
