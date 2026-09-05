import { describe, expect, it } from "vitest"
import { encodeKeySegment } from "./encodeKeySegment"

describe("encodeKeySegment", () => {
    it("encodes numbers as strings", () => {
        expect(encodeKeySegment(552)).toBe("552")
    })

    it("percent-encodes reserved characters", () => {
        expect(encodeKeySegment("a/b")).toBe("a%2Fb")
        expect(encodeKeySegment("a b")).toBe("a%20b")
    })
})
