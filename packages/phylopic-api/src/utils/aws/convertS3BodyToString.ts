import { Readable } from "stream"
const convertReadable = (body: Readable) =>
    new Promise<string>((resolve, reject) => {
        const responseDataChunks: string[] = []
        body.once("error", reject)
        body.on("data", chunk => responseDataChunks.push(chunk))
        body.once("end", () => resolve(responseDataChunks.join("")))
    })
const convertReadableStream = async (body: ReadableStream) => {
    const result = await body.getReader().read()
    return convertS3BodyToString(result.value)
}
export const convertS3BodyToString = async (
    body: Buffer | Readable | ReadableStream | Blob | string | undefined,
): Promise<string | undefined> => {
    if (body === undefined) {
        return undefined
    }
    if (typeof body === "string") {
        return body
    }
    if (body instanceof Buffer) {
        return body.toString("utf-8")
    }
    if (body instanceof Readable) {
        return convertReadable(body)
    }
    if (typeof (body as Blob)?.text === "function") {
        return (body as Blob).text()
    }
    if (body instanceof ReadableStream) {
        return convertReadableStream(body)
    }
    throw new Error("Unsupported body type.")
}
export default convertS3BodyToString
