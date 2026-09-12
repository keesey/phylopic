import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3"
import { stringifyNormalized } from "@phylopic/utils"
import { describe, expect, it, vi } from "vitest"
import { putJSON } from "./putJSON"

describe("putJSON", () => {
    const input = { Bucket: "bucket", Key: "key.json" }

    it("stringifies the object and puts it as JSON", async () => {
        const output = { $metadata: { httpStatusCode: 200 }, ETag: '"etag"' }
        const send = vi.fn().mockResolvedValue(output)
        const client = { send } as unknown as S3Client
        const object = { b: 2, a: 1 }

        await expect(putJSON(client, input, object)).resolves.toBe(output)
        expect(send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand)
        expect(send.mock.calls[0][0].input).toEqual({
            Bucket: "bucket",
            Key: "key.json",
            Body: stringifyNormalized(object),
            ContentType: "application/json",
            ServerSideEncryption: "AES256",
        })
    })

    it("throws when the response status is missing", async () => {
        const send = vi.fn().mockResolvedValue({ $metadata: {} })
        const client = { send } as unknown as S3Client
        await expect(putJSON(client, input, {})).rejects.toThrow("HTTP Error undefined")
    })

    it("throws when the response status is an error", async () => {
        const send = vi.fn().mockResolvedValue({ $metadata: { httpStatusCode: 403 } })
        const client = { send } as unknown as S3Client
        await expect(putJSON(client, input, {})).rejects.toThrow("HTTP Error 403")
    })
})
