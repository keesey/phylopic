import { expect } from "chai"
import { describe, it } from "mocha"
import { Link } from ".."
import validateEntityLink from "./validateEntityLink"
import { ValidationFault } from "./ValidationFault"
interface EntityType {
    label: string
    path: string
}
const NODE: EntityType = {
    label: "group",
    path: "nodes",
}
describe("validation/validateEntityLink", () => {
    const test = (link: unknown, required = false, entityType: EntityType = NODE, errorFields: string[] = []) => {
        describe(`when given ${JSON.stringify(link)}`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateEntityLink(link as Link | null, "link", entityType.path, entityType.label, required, [
                    "childNodes",
                    "parentNode",
                    "primaryImage",
                ])
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
                    const expected = errorFields.map(field => `_links.${field}`)
                    expect(result.map(fault => fault.field)).to.deep.equal(expected)
                })
            }
        })
    }
    test(null, false)
    test(null, true, NODE, ["link"])
    test("", false, NODE, ["link"])
    test({}, false, NODE, ["link.href"])
    test({ href: null }, false, NODE, ["link.href"])
    test({ href: "" }, false, NODE, ["link.href"])
    test({ href: "/foo" }, false, NODE, ["link.href"])
    test({ href: "#foo" }, false, NODE, ["link.href"])
    test({ href: "/nodes" }, false, NODE, ["link.href"])
    test({ href: "/nodes" }, false, NODE, ["link.href"])
    test({ href: "/nodes/1" }, false, NODE, ["link.href", "link.href"])
    test({ href: "/nodes/173d5da0-0a13-11e9-ab14-d663bd873d93" }, false, NODE, ["link.href", "link.href"]) // UUID v1
    test({ href: "/nodes/2221e818-2309-4380-8fb1-175b44d04adf" }, false, NODE, ["link.href"])
    test({ href: "/nodes/2221e818-2309-4380-8fb1-175b44d04adf?build=1" })
    test({ href: "/nodes/2221e818-2309-4380-8fb1-175b44d04adf?build=1&embed_foo=true" }, false, NODE, ["link.href"])
    test({ href: "/nodes/2221e818-2309-4380-8fb1-175b44d04adf?build=1&embed_parentNode=foo" }, false, NODE, [
        "link.href",
    ])
    test({ href: "/nodes/2221e818-2309-4380-8fb1-175b44d04adf?build=1&embed_parentNode=true" })
    test({
        href: "/nodes/2221e818-2309-4380-8fb1-175b44d04adf?build=1&embed_childNodes=true&embed_parentNode=true&embed_primaryImage=true",
    })
})
