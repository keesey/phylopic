import { HeadObjectCommand, type S3Client } from "@aws-sdk/client-s3"
import { describe, expect, it, vi } from "vitest"
import { objectExists } from "./objectExists"

describe("objectExists", () => {
    const input = { Bucket: "bucket", Key: "key.json" }

    it("returns true when HeadObject succeeds", async () => {
        const send = vi.fn().mockResolvedValue({})
        const client = { send } as unknown as S3Client
        await expect(objectExists(client, input)).resolves.toBe(true)
        expect(send).toHaveBeenCalledOnce()
        expect(send.mock.calls[0][0]).toBeInstanceOf(HeadObjectCommand)
    })

    it("returns false when HeadObject throws", async () => {
        const send = vi.fn().mockRejectedValue(new Error("NotFound"))
        const client = { send } as unknown as S3Client
        await expect(objectExists(client, input)).resolves.toBe(false)
    })
})
