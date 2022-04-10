import { expect } from "chai"
import { describe, it } from "mocha"
import { isEmailAddress } from "./isEmailAddress"
describe("isEmailAddress", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${expected ? "" : " not"} an email address.`, () => {
            const actual = isEmailAddress(value)
            expect(actual).to.equal(expected)
        })
    }
    test("keesey@gmail.com", true)
    test("keesey+phylopic@gmail.com", true)
    test("keesey.phylopic@gmail.com", true)
    test("foo@bar.baz", true)
    test("foo@bar", false)
    test("foo.bar@baz", false)
    test("foo", false)
    test("", false)
    test(null, false)
    test({}, false)
})
