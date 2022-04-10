import { expect } from "chai"
import { describe, it } from "mocha"
import { Name } from "../models/Name"
import { normalizeNames } from "./normalizeNames"
const HOMO_SAPIENS: Name = [
    {
        class: "scientific",
        text: "Homo sapiens",
    },
    {
        class: "citation",
        text: "Linnaeus 1758",
    },
]
const HOMO_HELMEI: Name = [
    {
        class: "scientific",
        text: "Homo helmei",
    },
    {
        class: "citation",
        text: "Dreyer 1935",
    },
]
const HUMANS: Name = [
    {
        class: "vernacular",
        text: "humans",
    },
]
const ORANG: Name = [
    {
        class: "vernacular",
        text: "orang",
    },
]
describe("normalizeNames", () => {
    const test = (value: readonly Name[], expected: readonly Name[]) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeNames(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test([], [])
    test([HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG], [HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG])
    test(
        [HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG, HOMO_SAPIENS, ORANG, HUMANS, HOMO_HELMEI],
        [HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG],
    )
    test([HOMO_SAPIENS, ORANG, HUMANS, HOMO_HELMEI], [HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG])
    test([ORANG, HOMO_SAPIENS, HUMANS, HOMO_HELMEI], [ORANG, HOMO_HELMEI, HOMO_SAPIENS, HUMANS])
})
