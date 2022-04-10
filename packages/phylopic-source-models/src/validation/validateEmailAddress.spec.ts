import { expect } from "chai"
import { describe, it } from "mocha"
import { EmailAddress } from "../models/EmailAddress"
import { validateEmailAddress } from "./validateEmailAddress"
describe("validateEmailAddress", () => {
    const test = (value: EmailAddress, valid: boolean) => {
        it(`should ${valid ? "not " : ""}throw for ${JSON.stringify(value)}`, () => {
            if (valid) {
                validateEmailAddress(value)
            } else {
                expect(() => validateEmailAddress(value)).to.throw
            }
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
