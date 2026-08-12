import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3"
import { describe, expect, it, vi } from "vitest"
import { putJSONString } from "./putJSONString"

describe("putJSONString", () => {
    const input = { Bucket: "bucket", Key: "key.json" }

    it("puts a JSON string body and returns the output", async () => {
        const output = { $metadata: { httpStatusCode: 200 }, ETag: '"etag"' }
        const send = vi.fn().mockResolvedValue(output)
        const client = { send } as unknown as S3Client

        await expect(putJSONString(client, input, '{"a":1}')).resolves.toBe(output)
        expect(send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand)
        expect(send.mock.calls[0][0].input).toEqual({
            Bucket: "bucket",
            Key: "key.json",
            Body: '{"a":1}',
            ContentType: "application/json",
        })
    })

    it("throws when the response status is missing", async () => {
        const send = vi.fn().mockResolvedValue({ $metadata: {} })
        const client = { send } as unknown as S3Client
        await expect(putJSONString(client, input, "{}")).rejects.toThrow("HTTP Error undefined")
    })

    it("throws when the response status is an error", async () => {
        const send = vi.fn().mockResolvedValue({ $metadata: { httpStatusCode: 500 } })
        const client = { send } as unknown as S3Client
        await expect(putJSONString(client, input, "{}")).rejects.toThrow("HTTP Error 500")
    })
})
