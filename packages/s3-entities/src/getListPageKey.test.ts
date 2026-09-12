import { describe, expect, it } from "vitest"
import { getListPageKey } from "./getListPageKey"

describe("getListPageKey", () => {
    it("builds a list page key", () => {
        expect(getListPageKey(552, "images", 3)).toBe("552/lists/images/pages/3.json")
    })
})
