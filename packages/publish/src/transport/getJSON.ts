import http, { RequestOptions } from "http"

const getJSON = <T>(options: RequestOptions | string | URL) =>
    new Promise<T>((resolve, reject) => {
        http.get(options, response => {
            const { statusCode } = response
            if (!statusCode || statusCode >= 400) {
                response.resume()
                return reject(statusCode ? new Error(http.STATUS_CODES[statusCode]) : "Unknown error.")
            }
            response.setEncoding("utf8")
            let rawData = ""
            response.on("data", chunk => {
                rawData += chunk
            })
            response.on("error", reject)
            response.on("end", () => {
                try {
                    const parsedData = JSON.parse(rawData)
                    resolve(parsedData as T)
                } catch (e) {
                    reject(e)
                }
            })
        }).on("error", reject)
    })
export default getJSON
