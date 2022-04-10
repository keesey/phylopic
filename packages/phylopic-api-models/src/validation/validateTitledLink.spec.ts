import { expect } from "chai"
import { describe, it } from "mocha"
import { TitledLink } from ".."
import validateTitledLink from "./validateTitledLink"
import { ValidationFault } from "./ValidationFault"
describe("validation/validateTitledLink", () => {
    const test = (link: unknown, required = false, errorFields: string[] = []) => {
        describe(`when given ${JSON.stringify(link)}`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateTitledLink(link as TitledLink | null, "link", required)
            })
            it("should yield an array", () => {
                /* tslint:disable:no-unused-expression */
                expect(Array.isArray(result)).to.be.true
                /* tslint:enable:no-unused-expression */
            })
            it(`should yield ${errorFields.length} error${errorFields.length === 1 ? "" : "s"}`, () => {
                expect(result.length).to.equal(errorFields.length)
            })
            if (errorFields.length) {
                it("should yield the expected error fields", () => {
                    const actual = result.map(fault => fault.field)
                    const expected = errorFields.map(field => `_links.${field}`)
                    expect(actual).to.deep.equal(expected)
                })
            }
        })
    }
    test(null, false)
    test(null, true, ["link"])
    test("", false, ["link"])
    test({}, false, ["link.href", "link.title"])
    test({ href: null }, false, ["link.href", "link.title"])
    test({ href: "" }, false, ["link.href", "link.title"])
    test({ href: "foo" }, false, ["link.title"])
    test({ title: "foo" }, false, ["link.href"])
    test({ href: "foo", title: "bar" })
})
