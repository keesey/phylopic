import { describe, expect, it } from "vitest"
import { EMPTY_UUID } from "../constants"
import { isUUID } from "./isUUID"
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
    test("66a33ed7-b935-0ca2-0853-20306606de29", false)
    test(EMPTY_UUID, true)
    test("foo", false)
    test("", false)
    test({}, false)
})
