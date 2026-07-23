import { describe, expect, it } from "vitest"
import { stringifyNormalized } from "./stringifyNormalized"
describe("stringifyNormalized", () => {
    const test = (value: unknown, expected: unknown) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = stringifyNormalized(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test(null, "null")
    test(true, "true")
    test("", '""')
    test(12.34, "12.34")
    test([], "[]")
    test({}, "{}")
    test([4, 3, 2, 1], "[4,3,2,1]")
    test({ a: 1, b: 2, c: 3 }, '{"a":1,"b":2,"c":3}')
    test({ a: 1, b: 2, c: 3, d: undefined }, '{"a":1,"b":2,"c":3}')
    test({ c: 1, b: 2, a: 3 }, '{"a":3,"b":2,"c":1}')
    test({ c: { e: { g: 7, f: 6 }, d: 4 }, b: 2, a: 3 }, '{"a":3,"b":2,"c":{"d":4,"e":{"f":6,"g":7}}}')
    test({ a: 3, c: { d: 4, e: { f: 6, g: 7 } }, b: 2 }, '{"a":3,"b":2,"c":{"d":4,"e":{"f":6,"g":7}}}')
})
