import { expect } from "chai"
import { describe, it } from "mocha"
import { ISODateTime } from "../models/ISODateTime"
import { validateISODateTime } from "./validateISODateTime"
describe("validateISODateTime", () => {
    const test = (value: ISODateTime, valid: boolean) => {
        it(`should ${valid ? "not " : ""}throw for ${JSON.stringify(value)}`, () => {
            if (valid) {
                validateISODateTime(value)
            } else {
                expect(() => validateISODateTime(value)).to.throw
            }
        })
    }
    test("2022-01-15T16:28:34.559Z", true)
    test("2022-21-15T16:28:34.559Z", false)
    test("2022-01-15T16:28:34.559", false)
    test("2022-01-15T16:28:34Z", false)
    test("2022-01-15", false)
    test("", false)
})
