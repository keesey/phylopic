import { expect } from "chai"
import { describe, it } from "mocha"
import { UUID } from "../models/UUID"
import { validateUUID } from "./validateUUID"
describe("validateUUID", () => {
    const test = (value: UUID, valid: boolean, normalized?: boolean) => {
        describe(`for ${JSON.stringify(value)}`, () => {
            it(`should ${valid ? "not " : ""}throw if not expected to be normalized`, () => {
                if (valid) {
                    validateUUID(value)
                } else {
                    expect(() => validateUUID(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if expected to be normalized`, () => {
                if (valid && normalized) {
                    validateUUID(value, true)
                } else {
                    expect(() => validateUUID(value, true)).to.throw
                }
            })
        })
    }
    test("1ee65cf3-53db-4a52-9960-a9f7093d845d", true, true)
    test(" 1ee65cf3-53db-4a52-9960-a9f7093d845d", false)
    test("1EE65CF3-53DB-4A52-9960-A9F7093D845D", true)
    test("00000000-0000-0000-0000-000000000000", true, true)
    test("foo", false)
    test("", false)
})
