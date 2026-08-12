import { Readable } from "stream"
import { afterEach, describe, expect, it, vi } from "vitest"
import { convertS3BodyToString } from "./convertS3BodyToString"

describe("convertS3BodyToString", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("returns an empty string for missing bodies", async () => {
        await expect(convertS3BodyToString(undefined)).resolves.toBe("")
    })

    it("returns string bodies unchanged", async () => {
        await expect(convertS3BodyToString("hello")).resolves.toBe("hello")
    })

    it("converts Buffer and Uint8Array bodies", async () => {
        await expect(convertS3BodyToString(Buffer.from("hello"))).resolves.toBe("hello")
        await expect(convertS3BodyToString(new Uint8Array([104, 105]))).resolves.toBe("hi")
    })

    it("reads Readable streams as utf-8 text", async () => {
        const body = Readable.from(["hel", "lo"])
        await expect(convertS3BodyToString(body)).resolves.toBe("hello")
    })

    it("reads Blob bodies with FileReader", async () => {
        class MockFileReader {
            public result: string | null = null
            public onload: (() => void) | null = null
            public onerror: ((error: Error) => void) | null = null
            public readAsText(blob: Blob) {
                void blob.text().then(text => {
                    this.result = text
                    this.onload?.()
                })
            }
        }
        vi.stubGlobal("FileReader", MockFileReader)
        const body = new Blob(["blob-text"], { type: "text/plain" })
        await expect(convertS3BodyToString(body)).resolves.toBe("blob-text")
    })

    it("rejects unsupported body types", async () => {
        await expect(convertS3BodyToString({} as never)).rejects.toThrow("Unsupported body type.")
    })
})
