import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("ENTITIES_BUCKET", () => {
    const env = process.env

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...env }
    })

    afterEach(() => {
        process.env = env
    })

    it("defaults to entities.phylopic.org", async () => {
        delete process.env.ENTITIES_BUCKET
        const { ENTITIES_BUCKET } = await import("./ENTITIES_BUCKET")
        expect(ENTITIES_BUCKET).toBe("entities.phylopic.org")
    })

    it("uses ENTITIES_BUCKET when set", async () => {
        process.env.ENTITIES_BUCKET = "test-bucket.example.org"
        const { ENTITIES_BUCKET } = await import("./ENTITIES_BUCKET")
        expect(ENTITIES_BUCKET).toBe("test-bucket.example.org")
    })
})
