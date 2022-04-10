import { expect } from "chai"
import { describe, it } from "mocha"
import { Name } from "../models/Name"
import { normalizeName } from "./normalizeName"
describe("normalizeName", () => {
    const test = (value: Name, expected: Name) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeName(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test([], [])
    test(
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
                class: "scientific",
                text: "Homo sapiens",
            },
            {
                class: "citation",
                text: "Linnaeus 1758",
            },
        ],
    )
    test(
        [
            {
                class: "scientific",
                text: "   Homo    sapiens     ",
            },
            {
                class: "citation",
                text: "\tLinnaeus     1758\n",
            },
        ],
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
    )
    test(
        [
            {
                class: "scientific",
                text: "Homo",
            },
            {
                class: "scientific",
                text: "sapiens",
            },
            {
                class: "citation",
                text: "Linnaeus",
            },
            {
                class: "citation",
                text: "1758",
            },
        ],
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
    )
    test(
        [
            {
                class: "vernacular",
                text: "humans",
            },
        ],
        [
            {
                class: "vernacular",
                text: "humans",
            },
        ],
    )
})
