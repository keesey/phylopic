import { expect } from "chai"
import { describe, it } from "mocha"
import { isISODateTime } from "./isISODateTime"
describe("isISODateTime", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${expected ? "" : " not"} an ISO date-time.`, () => {
            const actual = isISODateTime(value)
            expect(actual).to.equal(expected)
        })
    }
    test("2022-01-15T16:28:34.559Z", true)
    test("2022-21-15T16:28:34.559Z", false)
    test("2022-01-15T16:28:34.559", false)
    test("2022-01-15T16:28:34Z", false)
    test("2022-01-15", false)
    test("", false)
    test({}, false)
})
