import { Readable } from "stream"
import { describe, expect, it } from "vitest"
import { convertS3BodyToBuffer } from "./convertS3BodyToBuffer"

describe("convertS3BodyToBuffer", () => {
    it("returns Buffer bodies unchanged", async () => {
        const body = Buffer.from("hello")
        await expect(convertS3BodyToBuffer(body)).resolves.toBe(body)
    })

    it("converts strings to buffers", async () => {
        await expect(convertS3BodyToBuffer("hello")).resolves.toEqual(Buffer.from("hello"))
    })

    it("converts Uint8Array bodies to buffers", async () => {
        const body = new Uint8Array([104, 105])
        await expect(convertS3BodyToBuffer(body)).resolves.toEqual(Buffer.from("hi"))
    })

    it("reads Readable streams into buffers", async () => {
        const body = Readable.from([Buffer.from("hel"), Buffer.from("lo")])
        await expect(convertS3BodyToBuffer(body)).resolves.toEqual(Buffer.from("hello"))
    })

    it("rejects unsupported body types", async () => {
        await expect(convertS3BodyToBuffer(42)).rejects.toThrow("Unsupported body type.")
        await expect(convertS3BodyToBuffer(null)).rejects.toThrow("Unsupported body type.")
        await expect(convertS3BodyToBuffer(undefined)).rejects.toThrow("Unsupported body type.")
    })

    it("rejects when a Readable stream errors", async () => {
        const body = new Readable({
            read() {
                this.destroy(new Error("stream failed"))
            },
        })
        await expect(convertS3BodyToBuffer(body)).rejects.toThrow("stream failed")
    })
})
