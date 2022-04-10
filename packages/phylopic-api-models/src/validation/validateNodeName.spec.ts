import { expect } from "chai"
import { describe, it } from "mocha"
import { NodeName } from ".."
import validateNodeName from "./validateNodeName"
import { ValidationFault } from "./ValidationFault"
describe("validation/validateNodeName", () => {
    const test = (name: unknown, index = 0, field = "names", errorFields: string[] = []) => {
        describe(`when given ${JSON.stringify(name)} (index: ${index})`, () => {
            let result: readonly ValidationFault[] = []
            beforeEach(() => {
                result = validateNodeName(name as NodeName, index, field)
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
                    expect(actual).to.deep.equal(errorFields)
                })
            }
        })
    }
    test(null, 0, "names", ["names[0]"])
    test(null, 1, "names", ["names[1]"])
    test(null, 0, "foo", ["foo[0]"])
    test({}, 0, "names", ["names[0]"])
    test([], 0, "names", ["names[0]"])
    test([{}], 0, "names", ["names[0][0].class", "names[0][0].text"])
    test([{ class: {} }], 0, "names", ["names[0][0].class", "names[0][0].text"])
    test([{ class: "foo" }], 0, "names", ["names[0][0].class", "names[0][0].text"])
    test([{ text: {} }], 0, "names", ["names[0][0].class", "names[0][0].text"])
    test([{ text: "foo" }], 0, "names", ["names[0][0].class"])
    test([
        { class: "scientific", text: "Homo sapiens" },
        { class: "citation", text: "Linnaeus 1758" },
    ])
    test(
        [
            { class: "scientific", text: "Homo sapiens" },
            { class: "foo", text: "Linnaeus 1758" },
        ],
        0,
        "names",
        ["names[0][1].class"],
    )
    test(
        [
            { class: "scientific", text: "Homo sapiens" },
            { class: "citation", text: null },
        ],
        0,
        "names",
        ["names[0][1].text"],
    )
    test([{ class: "vernacular", text: "humans" }])
    test([
        { class: "scientific", text: "Odontochelys" },
        { class: "operator", text: "+" },
        { class: "scientific", text: "Testudines" },
    ])
    test([
        { class: "scientific", text: "Pinaceae" },
        { class: "rank", text: "fam." },
    ])
    test([
        { class: "scientific", text: "Troglodytes" },
        { class: "citation", text: "Vieillot 1809" },
        { class: "comment", text: "non" },
        { class: "citation", text: "St. Hilaire 1812" },
    ])
})
