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

    it("removes Adobe Illustrator PGF metadata and dangling encoded text", () => {
        const dirty =
            '<svg xmlns="http://www.w3.org/2000/svg"><switch></switch>\n\t\t\t\n\t\t\t\teJztfXlfGz3S4H4BfwcTAoGATUstqdVAABvb3DfhCCFgbGMcfOEjzzB/7GffqpLU3eZKZubdd5/d\n5Te/yZNWl6SqUt2qdibG9o8yuWrnppbxs146NTGx2quVB53efJpG0xvN5rA/6OHQ1OF0mrGsB0C5\n\t\t\t\n\t\t\n\t</svg>'
        const clean = sanitizeSVGString(dirty)
        expect(clean).not.toContain("eJztfXlf")
        expect(svgNeedsSanitization(dirty)).toBe(true)
    })

    it("removes i:pgf blocks before purification", () => {
        const dirty =
            '<svg xmlns="http://www.w3.org/2000/svg"><i:pgf id="adobe_illustrator_pgf">eJztfXlfGz3S4H4BfwcTAoGATUstqdVAABvb3DfhCCFgbGMcfOEjzzB/7GffqpLU3eZKZubdd5/d</i:pgf></svg>'
        const clean = sanitizeSVGString(dirty)
        expect(clean).not.toContain("eJztfXlf")
        expect(clean).not.toContain("i:pgf")
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
