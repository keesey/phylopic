import { expect } from "chai"
import { describe, it } from "mocha"
import { ISODateTime } from "../models/ISODateTime"
import { Name } from "../models/Name"
import { Node } from "../models/Node"
import { validateNode } from "./validateNode"
const VALID: Node = {
    created: "2022-01-15T22:08:43.135Z",
    names: [
        [
            {
                class: "scientific",
                text: "Homo sapiens",
            },
            {
                class: "citation",
                text: "Linnaeus 1758",
            },
        ],
        [
            {
                class: "vernacular",
                text: "humans",
            },
        ],
        [
            {
                class: "vernacular",
                text: "modern humans",
            },
        ],
    ],
    parent: "7b1368a2-e505-4a6c-a236-17c2dc529975",
}
describe("validateNode", () => {
    const test = (name: string, value: Node, valid: boolean, normalized?: boolean) => {
        describe(`for ${name}`, () => {
            it(`should ${valid ? "not " : ""}throw if it's not expected to be normalized`, () => {
                if (valid) {
                    validateNode(value)
                } else {
                    expect(() => validateNode(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if it's expected to be normalized`, () => {
                if (valid && normalized) {
                    validateNode(value, true)
                } else {
                    expect(() => validateNode(value, true)).to.throw
                }
            })
        })
    }
    test("a valid record with all fields", VALID, true, true)
    test("a record with no creation timestamp", { ...VALID, created: undefined as unknown as ISODateTime }, false)
    test("a record with an invalid creation timestamp", { ...VALID, created: "foo" }, false)
    test("a record with no name list", { ...VALID, names: undefined as unknown as readonly Name[] }, false)
    test("a record with an empty name list", { ...VALID, names: [] }, false)
    test(
        "a record with a non-normalized name list",
        { ...VALID, names: [VALID.names[0], VALID.names[2], VALID.names[1]] },
        true,
    )
    test("a record with an invalid name", { ...VALID, names: [...VALID.names, {}] } as unknown as Node, false)
    test("a record with an invalid name list", { ...VALID, names: {} } as unknown as Node, false)
    test("a record with no parent UUID", { ...VALID, parent: undefined }, true, true)
    test("a record with an invalid parent UUID", { ...VALID, parent: "foo" }, false)
    test(
        "a record with an non-normalized parent UUID",
        { ...VALID, parent: "7B1368A2-E505-4A6C-A236-17C2DC529975" },
        true,
    )
    test("an empty object", {} as unknown as Node, false)
    test("a null value", null as unknown as Node, false)
})
