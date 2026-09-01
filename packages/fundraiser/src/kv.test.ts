import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { isKvReadConfigured, isKvWriteConfigured } from "./kv"

describe("isKvReadConfigured", () => {
    const env = process.env

    beforeEach(() => {
        process.env = { ...env }
        delete process.env.KV_REST_API_URL
        delete process.env.KV_REST_API_TOKEN
        delete process.env.KV_REST_API_READ_ONLY_TOKEN
    })

    afterEach(() => {
        process.env = env
    })

    it("accepts a read-only token", () => {
        process.env.KV_REST_API_URL = "https://example.upstash.io"
        process.env.KV_REST_API_READ_ONLY_TOKEN = "read"
        expect(isKvReadConfigured()).toBe(true)
    })

    it("accepts a read-write token as fallback", () => {
        process.env.KV_REST_API_URL = "https://example.upstash.io"
        process.env.KV_REST_API_TOKEN = "write"
        expect(isKvReadConfigured()).toBe(true)
    })

    it("rejects missing credentials", () => {
        expect(isKvReadConfigured()).toBe(false)
    })
})

describe("isKvWriteConfigured", () => {
    const env = process.env

    beforeEach(() => {
        process.env = { ...env }
        delete process.env.KV_REST_API_URL
        delete process.env.KV_REST_API_TOKEN
        delete process.env.KV_REST_API_READ_ONLY_TOKEN
    })

    afterEach(() => {
        process.env = env
    })

    it("requires a read-write token", () => {
        process.env.KV_REST_API_URL = "https://example.upstash.io"
        process.env.KV_REST_API_READ_ONLY_TOKEN = "read"
        expect(isKvWriteConfigured()).toBe(false)
    })

    it("accepts a read-write token", () => {
        process.env.KV_REST_API_URL = "https://example.upstash.io"
        process.env.KV_REST_API_TOKEN = "write"
        expect(isKvWriteConfigured()).toBe(true)
    })
})
