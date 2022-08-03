import rawBody from "raw-body"
import { Readable } from "stream"
export const convertS3BodyToString = async (
    body: Readable | ReadableStream<any> | Blob | Uint8Array | string | undefined,
): Promise<string> => {
    if (!body) {
        return ""
    }
    if (typeof body === "string") {
        return body
    }
    if (typeof Blob !== "undefined" && body instanceof Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(convertS3BodyToString(reader.result as string))
            reader.onerror = reject
            reader.readAsText(body, "utf-8")
        })
    }
    if (body instanceof Buffer || body instanceof Uint8Array) {
        return Buffer.from(body).toString("utf-8")
    }
    if (body instanceof Readable) {
        return convertS3BodyToString(await rawBody(body, "utf-8"))
    }
    throw new Error("Unsupported body type.")
}
export default convertS3BodyToString
