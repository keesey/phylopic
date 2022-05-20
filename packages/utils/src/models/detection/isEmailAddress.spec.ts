import { expect } from "chai"
import { describe, it } from "mocha"
import { EmailAddress } from "../types/EmailAddress"
import isEmailAddress from "./isEmailAddress"
describe("isEmailAddress", () => {
    const test = (value: EmailAddress, valid: boolean) => {
        it(`should return ${valid ? "true" : "false"} for ${JSON.stringify(value)}.`, () => {
            expect(isEmailAddress(value)).to.equal(valid)
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
})
