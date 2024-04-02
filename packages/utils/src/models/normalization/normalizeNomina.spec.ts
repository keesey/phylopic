import { describe, expect, it } from "vitest"
import { Nomen } from "../types/Nomen"
import { normalizeNomina } from "./normalizeNomina"
const HOMO_SAPIENS: Nomen = [
    {
        class: "scientific",
        text: "Homo sapiens",
    },
    {
        class: "citation",
        text: "Linnaeus 1758",
    },
]
const HOMO_HELMEI: Nomen = [
    {
        class: "scientific",
        text: "Homo helmei",
    },
    {
        class: "citation",
        text: "Dreyer 1935",
    },
]
const HUMANS: Nomen = [
    {
        class: "vernacular",
        text: "humans",
    },
]
const ORANG: Nomen = [
    {
        class: "vernacular",
        text: "orang",
    },
]
describe("normalizeNomina", () => {
    const test = (value: readonly Nomen[], expected: readonly Nomen[]) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeNomina(value)
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
