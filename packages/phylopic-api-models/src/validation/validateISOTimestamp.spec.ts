import { expect } from "chai"
import { describe, it } from "mocha"
import validateISOTimestamp from "./validateISOTimestamp"
import { ValidationFault } from "./ValidationFault"
describe("validation/validateISOTimestamp", () => {
    const test = (value: string, isError = false) => {
        describe(`when given "${value}"`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateISOTimestamp(value, "value")
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
                it('should give the field as "value"', () => {
                    expect(result[0].field).to.equal("value")
                })
            }
        })
    }
    test("2018-12-27T06:40:53.728Z")
    test("1900-01-01T00:00:00.000Z")
    test("2900-12-31T23:59:59.999Z")
    test("", true)
    test("foo", true)
    test("2900-13-31T23:59:59.999Z", true)
    test("2900-12-32T23:59:59.999Z", true)
    test("2900-12-31T24:59:59.999Z", true)
    test("2900-12-31T23:60:59.999Z", true)
    test("2900-12-31T23:59:60.999Z", true)
})
