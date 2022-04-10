import rawBody from "raw-body"
import { Readable } from "stream"
export const convertS3BodyToBuffer = async (body: unknown): Promise<Buffer> => {
    if (body instanceof Buffer) {
        return body
    }
    if (typeof body === "string" || body instanceof Uint8Array) {
        return Buffer.from(body)
    }
    if (body instanceof Readable) {
        return convertS3BodyToBuffer(await rawBody(body, {}))
    }
    console.error("Unrecognized body: ", body)
    throw new Error("Unsupported body type.")
}
export default convertS3BodyToBuffer
