import { describe, expect, it } from "vitest"
import { mostLeafwardCommonAncestor } from "./mostLeafwardCommonAncestor.js"

describe("mostLeafwardCommonAncestor", () => {
    it("returns deepest shared ancestor (root-to-tip prefix)", () => {
        const homo = ["homo", "homininae", "hominidae", "root"]
        const pan = ["pan", "homininae", "hominidae", "root"]
        expect(mostLeafwardCommonAncestor([homo, pan])).toBe("homininae")
    })

    it("returns root when that is the only shared ancestor", () => {
        expect(mostLeafwardCommonAncestor([["a", "root"], ["b", "root"]])).toBe("root")
    })

    it("returns null for empty input", () => {
        expect(mostLeafwardCommonAncestor([])).toBeNull()
    })
})
