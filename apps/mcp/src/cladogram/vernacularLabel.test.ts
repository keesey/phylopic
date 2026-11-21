import { describe, expect, it } from "vitest"
import { derivedGroupNames, isPossibleCommonName } from "./vernacularLabel.js"

describe("derivedGroupNames", () => {
    it.each([
        ["Bovine", "Bovinae"],
        ["felines", "Felinae"],
        ["hominid", "Hominidae"],
        ["hominoids", "Hominoidea"],
        ["hominin", "Hominini"],
    ])("reads %s as %s", (label, expected) => {
        expect(derivedGroupNames(label)).toEqual([expected])
    })

    it("ignores words without a group suffix", () => {
        expect(derivedGroupNames("Rodent")).toEqual([])
    })
})

describe("isPossibleCommonName", () => {
    it("accepts short plain words", () => {
        expect(isPossibleCommonName("Bovine")).toBe(true)
        expect(isPossibleCommonName("great apes")).toBe(true)
    })

    it("rejects abbreviations and numbered labels", () => {
        expect(isPossibleCommonName("H. sapiens")).toBe(false)
        expect(isPossibleCommonName("clade 12")).toBe(false)
    })
})
