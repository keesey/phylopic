import { expect } from "chai"
import { describe, it } from "mocha"
import { isUUID } from "./isUUID.js"
describe("isUUID", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${
            expected ? "" : " not"
        } a Universal Unique Identifier.`, () => {
            const actual = isUUID(value)
            expect(actual).to.equal(expected)
        })
    }
    test("1ee65cf3-53db-4a52-9960-a9f7093d845d", true)
    test(" 1ee65cf3-53db-4a52-9960-a9f7093d845d", false)
    test("1EE65CF3-53DB-4A52-9960-A9F7093D845D", true)
    test("00000000-0000-0000-0000-000000000000", true)
    test("foo", false)
    test("", false)
    test({}, false)
})
