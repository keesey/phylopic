import { expect } from "chai"
import { describe, it } from "mocha"
import { Main } from "../models/Main"
import { validateMain } from "./validateMain"
const VALID: Main = {
    build: 1,
    root: "8f901db5-84c1-4dc0-93ba-2300eeddf4ab",
}
describe("validateMain", () => {
    const test = (name: string, value: Main, valid: boolean, normalized?: boolean) => {
        describe(`for ${name}`, () => {
            it(`should ${valid ? "not " : ""}throw if it's not expected to be normalized`, () => {
                if (valid) {
                    validateMain(value)
                } else {
                    expect(() => validateMain(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if it's expected to be normalized`, () => {
                if (valid && normalized) {
                    validateMain(value, true)
                } else {
                    expect(() => validateMain(value, true)).to.throw
                }
            })
        })
    }
    test("a valid record", VALID, true, true)
    test(
        "a build number of zero",
        {
            ...VALID,
            build: 0,
        },
        false,
    )
    test(
        "a fractional build number",
        {
            ...VALID,
            build: 1.5,
        },
        false,
    )
    test(
        "NaN as a build number",
        {
            ...VALID,
            build: NaN,
        },
        false,
    )
    test(
        "an infinite build number",
        {
            ...VALID,
            build: Infinity,
        },
        false,
    )
    test(
        "a root UUID in all caps",
        {
            ...VALID,
            root: "8F901DB5-84C1-4DC0-93BA-2300EEDDF4AB",
        },
        true,
    )
    test(
        "an invalid root UUID",
        {
            ...VALID,
            root: "foo",
        },
        false,
    )
    test("an empty object", {} as unknown as Main, false)
    test("a null value", null as unknown as Main, false)
})
