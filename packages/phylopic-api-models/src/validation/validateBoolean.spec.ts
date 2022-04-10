import { expect } from "chai"
import { describe, it } from "mocha"
import validateBoolean from "./validateBoolean"
import { ValidationFault } from "./ValidationFault"
describe("validation/validateBoolean", () => {
    const test = (value: string | undefined, isError = false, field = "field", fieldLabel = "") => {
        describe(`when given ${typeof value === "string" ? `"${value}"` : value}`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateBoolean(value, field, fieldLabel || field)
            })
            it("should yield an array", () => {
                /* tslint:disable:no-unused-expression */
                expect(Array.isArray(result)).to.be.true
                /* tslint:enable:no-unused-expression */
            })
            it(`should${isError ? "" : " not"} yield an error`, () => {
                expect(result.length).to.equal(isError ? 1 : 0)
            })
            if (isError) {
                it(`should give the field as "${field}"`, () => {
                    expect(result[0].field).to.equal(field)
                })
            }
        })
    }
    test(undefined)
    test("")
    test("true")
    test("false")
    test("TRUE", true)
    test("FALSE", true)
    test("t", true)
    test("f", true)
    test("t", true, "foo")
    test("t", true, "foo", "bar")
})
