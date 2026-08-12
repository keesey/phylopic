import { describe, expect, it } from "vitest"
import { isHash } from "./isHash"

describe("isHash", () => {
    it("accepts a 64-character SHA-256 hex digest", () => {
        expect(isHash("a".repeat(64))).toBe(true)
    })

    it("rejects empty, short, and non-hex strings", () => {
        expect(isHash("")).toBe(false)
        expect(isHash("a")).toBe(false)
        expect(isHash("g".repeat(64))).toBe(false)
        expect(isHash("a".repeat(63))).toBe(false)
        expect(isHash("a".repeat(65))).toBe(false)
    })
})
