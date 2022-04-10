import { expect } from "chai"
import { describe, it } from "mocha"
import { validateText } from "./validateText"
describe("validateText", () => {
    const test = (value: string, valid: boolean, normalized?: boolean) => {
        describe(`for ${JSON.stringify(value)}`, () => {
            it(`should ${valid ? "not " : ""}throw if not expected to be normalized`, () => {
                if (valid) {
                    validateText(value)
                } else {
                    expect(() => validateText(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if expected to be normalized`, () => {
                if (valid && normalized) {
                    validateText(value, true)
                } else {
                    expect(() => validateText(value, true)).to.throw
                }
            })
        })
    }
    test("foo", true, true)
    test("  foo  ", true)
    test("foo bar", true, true)
    test("foo  bar", true, false)
    test("   ", false)
    test("", false)
    test(null as unknown as string, false)
})
