import { expect } from "chai"
import { describe, it } from "mocha"
import { Name } from "../models/Name"
import { NodeIdentifier } from "../models/NodeIdentifier"
import { validateNodeIdentifier } from "./validateNodeIdentifier"
const VALID: NodeIdentifier = {
    identifier: ["eol.org", "pages", "327955"],
    name: [
        {
            class: "scientific",
            text: "Homo sapiens",
        },
        {
            class: "citation",
            text: "Linnaeus 1758",
        },
    ],
}
describe("validateNodeIdentifier", () => {
    const test = (name: string, value: NodeIdentifier, valid: boolean, normalized?: boolean) => {
        describe(`for ${name}`, () => {
            it(`should ${valid ? "not " : ""}throw if it's not expected to be normalized`, () => {
                if (valid) {
                    validateNodeIdentifier(value)
                } else {
                    expect(() => validateNodeIdentifier(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if it's expected to be normalized`, () => {
                if (valid && normalized) {
                    validateNodeIdentifier(value, true)
                } else {
                    expect(() => validateNodeIdentifier(value, true)).to.throw
                }
            })
        })
    }
    test("a valid record with all fields", VALID, true, true)
    test("a valid record with no identifier", { ...VALID, identifier: undefined }, true, true)
    test(
        "a valid record with an invalid identifier",
        { ...VALID, identifier: "foo" as unknown as NodeIdentifier["identifier"] },
        false,
    )
    test(
        "a valid record with an identifier with an invalid authority",
        { ...VALID, identifier: ["foo", "pages", "327955"] as unknown as NodeIdentifier["identifier"] },
        false,
    )
    test(
        "a valid record with an identifier with an invalid namespace",
        { ...VALID, identifier: ["eol.org", "bar", "327955"] as unknown as NodeIdentifier["identifier"] },
        false,
    )
    test(
        "a valid record with an identifier with an invalid id",
        { ...VALID, identifier: ["eol.org", "pages", 327955] as unknown as NodeIdentifier["identifier"] },
        false,
    )
    test(
        "a valid record with an identifier with an empty id",
        { ...VALID, identifier: ["eol.org", "pages", ""] },
        false,
    )
    test(
        "a valid record with an identifier with an untrimmed id",
        { ...VALID, identifier: ["eol.org", "pages", "    327955      "] },
        false,
    )
    test("a valid record with no name", { ...VALID, name: undefined as unknown as Name }, false)
    test("a valid record with an invalid name", { ...VALID, name: [] }, false)
    test(
        "a valid record with a non-normalized name",
        {
            ...VALID,
            name: [
                ...VALID.name,
                {
                    class: "citation",
                    text: "Extra Text",
                },
            ],
        },
        true,
    )
})
