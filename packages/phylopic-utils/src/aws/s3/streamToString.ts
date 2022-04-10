import { Readable } from "stream"
export const streamToString = (stream?: Readable) =>
    stream
        ? new Promise<string>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const chunks: any[] = []
            stream.on("data", chunk => chunks.push(chunk))
            stream.on("error", reject)
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
        })
        : Promise.reject(new Error(`Not a stream: ${stream}.`))
export default streamToString
