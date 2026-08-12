import { DeleteObjectsCommand, ListObjectsV2Command, type S3Client } from "@aws-sdk/client-s3"
import { describe, expect, it, vi } from "vitest"
import { deletePrefix } from "./deletePrefix"

describe("deletePrefix", () => {
    it("lists and deletes matching objects across pages", async () => {
        const send = vi
            .fn()
            .mockResolvedValueOnce({
                Contents: [{ Key: "prefix/a.json" }, { Key: "prefix/b.json" }, { Key: undefined }],
                NextContinuationToken: "token-1",
            })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({
                Contents: [{ Key: "prefix/c.json" }],
            })
            .mockResolvedValueOnce({})
        const client = { send } as unknown as S3Client

        await deletePrefix(client, "bucket", "prefix/")

        expect(send).toHaveBeenCalledTimes(4)
        expect(send.mock.calls[0][0]).toBeInstanceOf(ListObjectsV2Command)
        expect(send.mock.calls[0][0].input).toEqual({
            Bucket: "bucket",
            ContinuationToken: undefined,
            Prefix: "prefix/",
        })
        expect(send.mock.calls[1][0]).toBeInstanceOf(DeleteObjectsCommand)
        expect(send.mock.calls[1][0].input).toEqual({
            Bucket: "bucket",
            Delete: {
                Objects: [{ Key: "prefix/a.json" }, { Key: "prefix/b.json" }],
            },
        })
        expect(send.mock.calls[2][0].input).toEqual({
            Bucket: "bucket",
            ContinuationToken: "token-1",
            Prefix: "prefix/",
        })
        expect(send.mock.calls[3][0].input).toEqual({
            Bucket: "bucket",
            Delete: {
                Objects: [{ Key: "prefix/c.json" }],
            },
        })
    })

    it("skips deletion when a page has no keys", async () => {
        const send = vi.fn().mockResolvedValueOnce({ Contents: [] })
        const client = { send } as unknown as S3Client

        await deletePrefix(client, "bucket", "empty/")

        expect(send).toHaveBeenCalledOnce()
        expect(send.mock.calls[0][0]).toBeInstanceOf(ListObjectsV2Command)
    })

    it("skips deletion when Contents is missing", async () => {
        const send = vi.fn().mockResolvedValueOnce({})
        const client = { send } as unknown as S3Client

        await deletePrefix(client, "bucket", "missing/")

        expect(send).toHaveBeenCalledOnce()
    })
})
