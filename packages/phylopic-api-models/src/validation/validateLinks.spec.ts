import { expect } from "chai"
import { describe, it } from "mocha"
import validateLinks from "./validateLinks"
import { ValidationFault } from "./ValidationFault"
describe("validation/validateLinks", () => {
    const test = (links: unknown, isError = false) => {
        describe(`when given ${JSON.stringify(links)}`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateLinks(links)
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
                it('should give the field as "_links"', () => {
                    expect(result[0].field).to.equal("_links")
                })
            }
        })
    }
    test(null, true)
    test({})
    test({ link: { href: "/foo" } })
})
