import rawBody from "raw-body"
import { Readable } from "stream"
export const convertS3BodyToString = async (body: unknown): Promise<string> => {
    if (typeof body === "string") {
        return body
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
