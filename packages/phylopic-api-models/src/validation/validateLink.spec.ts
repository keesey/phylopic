import { expect } from "chai"
import { describe, it } from "mocha"
import { Link } from ".."
import validateLink from "./validateLink"
import { ValidationFault } from "./ValidationFault"
describe("validation/validateLink", () => {
    const test = (link: unknown, required = false, errorField = "") => {
        describe(`when given ${JSON.stringify(link)}`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateLink(link as Link | null, "link", required)
            })
            it("should yield an array", () => {
                /* tslint:disable:no-unused-expression */
                expect(Array.isArray(result)).to.be.true
                /* tslint:enable:no-unused-expression */
            })
            it(`should${errorField ? "" : " not"} yield an error`, () => {
                expect(result.length).to.equal(errorField ? 1 : 0)
            })
            if (errorField) {
                it(`should give the field as "_links.${errorField}"`, () => {
                    expect(result[0].field).to.equal(`_links.${errorField}`)
                })
            }
        })
    }
    test(null, false)
    test(null, true, "link")
    test("", false, "link")
    test({}, false, "link.href")
    test({ href: null }, false, "link.href")
    test({ href: "" }, false, "link.href")
    test({ href: "/foo" })
    test({ href: "#foo" })
})
