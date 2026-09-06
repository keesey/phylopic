import { describe, expect, it } from "vitest"
import { getListIndexKey } from "./getListIndexKey"

describe("getListIndexKey", () => {
    it("builds a list index key", () => {
        expect(getListIndexKey(552, "contributors")).toBe("552/lists/contributors/index.json")
    })
})
