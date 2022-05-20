import http from "http"

const getImage = (url: string, binary = false) =>
    new Promise<Buffer | string>((resolve, reject) => {
        http.get(url, response => {
            const { statusCode } = response
            if (!statusCode || statusCode >= 400) {
                response.resume()
                return reject(new Error(statusCode ? http.STATUS_CODES[statusCode] : "Unknown error."))
            }
            response.setEncoding(binary ? "binary" : "utf8")
            const rawData: any[] = []
            response.on("data", chunk => {
                rawData.push(binary ? Buffer.from(chunk, "binary") : chunk)
            })
            response.on("error", reject)
            response.on("end", () => {
                try {
                    resolve(binary ? Buffer.concat(rawData) : rawData.join(""))
                } catch (e) {
                    reject(e)
                }
            })
        }).on("error", reject)
    })
export default getImage
