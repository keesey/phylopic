import { Readable } from "stream"
export const streamToString = (stream?: Readable, encoding?: BufferEncoding) =>
    stream
        ? new Promise<string>((resolve, reject) => {
              const chunks: any[] = []
              stream.on("data", chunk => chunks.push(chunk))
              stream.on("error", reject)
              stream.on("end", () => resolve(Buffer.concat(chunks).toString(encoding ?? "utf8")))
          })
        : Promise.reject(new Error(`Not a stream: ${stream}.`))
export default streamToString
