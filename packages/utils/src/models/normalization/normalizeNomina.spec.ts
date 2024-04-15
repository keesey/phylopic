import { describe, expect, it } from "vitest"
import { Nomen } from "../types/Nomen"
import { normalizeNomina } from "./normalizeNomina"
import { stringifyNomen } from "../../nomina"
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
const HOMO_SAPIENS_UNCITED: Nomen = [
    {
        class: "scientific",
        text: "Homo sapiens",
    },
]
const HOMO_SAPIENS_ALT_CITATION: Nomen = [
    {
        class: "scientific",
        text: "Homo sapiens",
    },
    {
        class: "citation",
        text: "L.",
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
const stringifyNomina = (nomina: readonly Nomen[]) => nomina.map(n => stringifyNomen(n)).join("; ")
describe("normalizeNomina", () => {
    const test = (value: readonly Nomen[], expected: readonly Nomen[]) => {
        it(`should convert ${stringifyNomina(value)} to ${stringifyNomina(expected)}`, () => {
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
    test([HOMO_SAPIENS, HOMO_SAPIENS_UNCITED, HOMO_HELMEI, HUMANS, ORANG], [HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG])
    test([HOMO_SAPIENS_UNCITED, HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG], [HOMO_SAPIENS, HOMO_HELMEI, HUMANS, ORANG])
    test([HOMO_SAPIENS, HOMO_SAPIENS_ALT_CITATION], [HOMO_SAPIENS, HOMO_SAPIENS_ALT_CITATION])
    test(
        [HOMO_SAPIENS_UNCITED, HOMO_SAPIENS, HOMO_SAPIENS_ALT_CITATION],
        [HOMO_SAPIENS_UNCITED, HOMO_SAPIENS_ALT_CITATION, HOMO_SAPIENS],
    )
    test([HOMO_SAPIENS_UNCITED, HOMO_SAPIENS], [HOMO_SAPIENS])
    test([HOMO_SAPIENS_UNCITED, HOMO_SAPIENS, HUMANS, ORANG], [HOMO_SAPIENS, HUMANS, ORANG])
    test([HOMO_SAPIENS, HOMO_SAPIENS_UNCITED, HOMO_SAPIENS_ALT_CITATION], [HOMO_SAPIENS, HOMO_SAPIENS_ALT_CITATION])
})
