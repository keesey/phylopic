import { expect } from "chai"
import { describe, it } from "mocha"
import { Name } from "../models/Name"
import { validateName } from "./validateName"
describe("validateName", () => {
    const test = (value: Name, valid: boolean, normalized?: boolean) => {
        describe(`for ${JSON.stringify(value)}`, () => {
            it(`should ${valid ? "not " : ""}throw if it's not expected to be normalized`, () => {
                if (valid) {
                    validateName(value)
                } else {
                    expect(() => validateName(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if it's expected to be normalized`, () => {
                if (valid && normalized) {
                    validateName(value, true)
                } else {
                    expect(() => validateName(value, true)).to.throw
                }
            })
        })
    }
    test(
        [
            { class: "scientific", text: "Homo sapiens" },
            { class: "citation", text: "Linnaeus 1758" },
        ],
        true,
        true,
    )
    test([{ class: "vernacular", text: "humans" }], true, true)
    test([{ class: "vernacular", text: "    humans" }], true)
    test(
        [
            { class: "scientific", text: "Homo" },
            { class: "scientific", text: "sapiens" },
            { class: "citation", text: "Linnaeus" },
            { class: "citation", text: "1758" },
        ],
        true,
        false,
    )
    test([], false)
    test([{ class: "foo", text: "humans" }] as unknown as Name, false)
    test([{ class: "foo", foo: "bar", text: "humans" }] as unknown as Name, false)
    test([{ class: "vernacular" }] as unknown as Name, false)
    test([{ text: "humans" }] as unknown as Name, false)
    test([1, 2, 3] as unknown as Name, false)
    test({} as unknown as Name, false)
    test(null as unknown as Name, false)
})
