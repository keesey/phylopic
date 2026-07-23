import { Readable } from "stream"
export const convertS3BodyToBuffer = async (body: unknown): Promise<Buffer> => {
    if (body instanceof Buffer) {
        return body
    }
    if (typeof body === "string" || body instanceof Uint8Array) {
        return Buffer.from(body)
    }
    if (body instanceof Readable) {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Uint8Array[] = []
            body.on("data", chunk => chunks.push(chunk))
            body.on("error", reject)
            body.on("end", () => resolve(Buffer.concat(chunks)))
        })
    }
    throw new Error("Unsupported body type.")
}
