import { describe, expect, it } from "vitest"
import { getStaticJSONKey } from "./getStaticJSONKey"

describe("getStaticJSONKey", () => {
    it("builds a static JSON key", () => {
        expect(getStaticJSONKey(552, "namespaces")).toBe("552/namespaces.json")
    })
})
