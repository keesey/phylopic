import { describe, expect, it } from "vitest"
import { getLineagePageKey } from "./getLineagePageKey"

describe("getLineagePageKey", () => {
    it("builds a lineage page key", () => {
        expect(getLineagePageKey(552, "550e8400-e29b-41d4-a716-446655440000", 2)).toBe(
            "552/lineages/550e8400-e29b-41d4-a716-446655440000/pages/2.json",
        )
    })
})
