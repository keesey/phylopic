import { expect } from "chai"
import { describe, it } from "mocha"
import normalizeText from "./normalizeText.js"
describe("normalizeText", () => {
    const test = (value: string, expected: string) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeText(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test("", "")
    test(" ", "")
    test("   \t\n\t\n    ", "")
    test("Homo sapiens", "Homo sapiens")
    test("Homo  sapiens", "Homo sapiens")
    test("  Homo   sapiens    ", "Homo sapiens")
    test(" \t\n Homo  \t\n sapiens  \t\n  ", "Homo sapiens")
})
