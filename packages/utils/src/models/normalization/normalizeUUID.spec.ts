import { describe, expect, it } from "vitest"
import { UUID } from "../types/UUID"
import { normalizeUUID } from "./normalizeUUID"
describe("normalizeUUID", () => {
    const test = (value: UUID, expected: UUID) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeUUID(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test("1ee65cf3-53db-4a52-9960-a9f7093d845d", "1ee65cf3-53db-4a52-9960-a9f7093d845d")
    test("1EE65CF3-53DB-4A52-9960-A9F7093D845D", "1ee65cf3-53db-4a52-9960-a9f7093d845d")
})
