import { describe, expect, it } from "vitest"
import { containsRemovableThreats, isLikelySVG, sanitizeSVGString, svgNeedsSanitization } from "./sanitizeSVG"

describe("sanitizeSVGString", () => {
    it("removes script elements", () => {
        const dirty = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle r="1"/></svg>'
        const clean = sanitizeSVGString(dirty)
        expect(clean).not.toContain("<script")
        expect(clean).toContain("<circle")
    })

    it("detects when DOMPurify would remove threats", () => {
        const dirty = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
        expect(svgNeedsSanitization(dirty)).toBe(true)
    })

    it("ignores cosmetic-only normalization", () => {
        const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>'
        expect(containsRemovableThreats(svg)).toBe(false)
        expect(svgNeedsSanitization(svg)).toBe(false)
    })

    it("flags exporter metadata scripts for migration", () => {
        const svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><script type="application/json">{}</script><path d="M0 0"/></svg>'
        expect(svgNeedsSanitization(svg)).toBe(true)
    })
})

describe("isLikelySVG", () => {
    it("detects svg by content type", () => {
        expect(isLikelySVG(Buffer.from("not svg"), "image/svg+xml")).toBe(true)
    })

    it("detects svg by content", () => {
        expect(isLikelySVG(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe(true)
        expect(isLikelySVG(Buffer.from("not svg"))).toBe(false)
    })
})
