import { describe, expect, it } from "vitest"
import { getEntityJSONKey } from "./getEntityJSONKey"

describe("getEntityJSONKey", () => {
    it("builds an encoded entity JSON key", () => {
        expect(getEntityJSONKey(552, "nodes", "550e8400-e29b-41d4-a716-446655440000")).toBe(
            "552/nodes/550e8400-e29b-41d4-a716-446655440000.json",
        )
    })

    it("encodes path segments in folder names", () => {
        expect(getEntityJSONKey(1, "images", "a/b")).toBe("1/images/a%2Fb.json")
    })
})
