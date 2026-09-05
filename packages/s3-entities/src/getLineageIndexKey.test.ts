import { describe, expect, it } from "vitest"
import { getLineageIndexKey } from "./getLineageIndexKey"

describe("getLineageIndexKey", () => {
    it("builds a lineage index key", () => {
        expect(getLineageIndexKey(552, "550e8400-e29b-41d4-a716-446655440000")).toBe(
            "552/lineages/550e8400-e29b-41d4-a716-446655440000/index.json",
        )
    })
})
