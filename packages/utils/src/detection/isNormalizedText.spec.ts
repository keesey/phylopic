import { describe, expect, it } from "vitest"
import { isNormalizedText } from "./isNormalizedText"
describe("isNormalizedText", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${expected ? "" : " not"} normalized text.`, () => {
            const actual = isNormalizedText(value)
            expect(actual).to.equal(expected)
        })
    }
    test("Lorem ipsum dolor sit amet.", true)
    test("  Lorem ipsum dolor sit amet.", false)
    test("Lorem ipsum dolor sit amet.\t", false)
    test("Lorem\nipsum\ndolor\nsit\namet.", false)
    test("Lorem  ipsum dolor sit amet.", false)
    test(" \t\nLorem \t\nipsum \t\ndolor sit amet. \t\n", false)
    test("", false)
    test({}, false)
})
