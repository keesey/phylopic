import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3"
import { type FaultDetector, type ValidationFaultCollector } from "@phylopic/utils"
import { describe, expect, it, vi } from "vitest"
import { getJSON } from "./getJSON"

describe("getJSON", () => {
    const input = { Bucket: "bucket", Key: "key.json" }

    it("fetches, parses, and returns JSON without a detector", async () => {
        const output = {
            Body: '{"name":"Ada"}',
            $metadata: { httpStatusCode: 200 },
        }
        const send = vi.fn().mockResolvedValue(output)
        const client = { send } as unknown as S3Client

        const [object, response] = await getJSON<{ name: string }>(client, input)
        expect(send.mock.calls[0][0]).toBeInstanceOf(GetObjectCommand)
        expect(object).toEqual({ name: "Ada" })
        expect(response).toBe(output)
    })

    it("returns the object when a detector accepts it", async () => {
        const detect: FaultDetector<{ ok: boolean }> = (value): value is { ok: boolean } =>
            typeof value === "object" && value !== null && "ok" in value
        const send = vi.fn().mockResolvedValue({ Body: '{"ok":true}' })
        const client = { send } as unknown as S3Client

        const [object] = await getJSON(client, input, detect)
        expect(object).toEqual({ ok: true })
    })

    it("throws a detailed error when a detector rejects the object", async () => {
        const detect: FaultDetector<{ ok: boolean }> = (
            _value,
            faultCollector?: ValidationFaultCollector,
        ): _value is { ok: boolean } => {
            faultCollector?.add("Expected ok flag.")
            faultCollector?.sub("ok").add("Must be a boolean.")
            return false
        }
        const send = vi.fn().mockResolvedValue({ Body: '{"ok":"nope"}' })
        const client = { send } as unknown as S3Client

        await expect(getJSON(client, input, detect)).rejects.toThrow(
            "Error in file s3://bucket/key.json:Expected ok flag.\n\nMust be a boolean. [ok]",
        )
    })

    it("throws a fallback message when a detector rejects without faults", async () => {
        const detect: FaultDetector<unknown> = (): never => false as never
        const send = vi.fn().mockResolvedValue({ Body: "{}" })
        const client = { send } as unknown as S3Client

        await expect(getJSON(client, input, detect)).rejects.toThrow(
            "Error in file s3://bucket/key.json:Invalid object.",
        )
    })
})
