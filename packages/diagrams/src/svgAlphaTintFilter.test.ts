import { describe, expect, it } from "vitest"
import { svgAlphaTintFilterDef, svgAlphaTintFilterRef, svgFilterId } from "./svgAlphaTintFilter.js"

describe("svgAlphaTintFilter", () => {
    it("builds a filter that tints via SourceAlpha", () => {
        const id = svgFilterId("clade-1")
        expect(svgAlphaTintFilterDef(id, "#4477AA")).toContain(`id="${id}"`)
        expect(svgAlphaTintFilterDef(id, "#4477AA")).toContain('flood-color="#4477AA"')
        expect(svgAlphaTintFilterDef(id, "#4477AA")).toContain("SourceAlpha")
        expect(svgAlphaTintFilterRef(id)).toBe(`url(#${id})`)
    })
})
