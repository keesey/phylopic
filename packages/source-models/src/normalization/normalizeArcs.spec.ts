import { expect } from "chai"
import { describe, it } from "mocha"
import { Arc } from "../types/Arc"
import normalizeArcs from "./normalizeArcs"
describe("normalizeArcs", () => {
    const test = (value: readonly Arc[], expected: readonly Arc[]) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeArcs(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test([], [])
    test([["a", "b"]], [["a", "b"]])
    test(
        [
            ["a", "b"],
            ["a", "b"],
        ],
        [["a", "b"]],
    )
    test(
        [
            ["a", "b"],
            ["b", "c"],
        ],
        [
            ["a", "b"],
            ["b", "c"],
        ],
    )
    test(
        [
            ["b", "c"],
            ["a", "c"],
            ["a", "b"],
        ],
        [
            ["a", "b"],
            ["a", "c"],
            ["b", "c"],
        ],
    )
})
