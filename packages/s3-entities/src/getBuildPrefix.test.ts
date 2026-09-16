import { describe, expect, it } from "vitest"
import { getBuildPrefix } from "./getBuildPrefix"

describe("getBuildPrefix", () => {
    it("returns an encoded build prefix", () => {
        expect(getBuildPrefix(552)).toBe("552/")
    })
})
