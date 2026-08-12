import { describe, expect, it } from "vitest"
import { hasLeadingSvgCorruption, sanitizeSVGLiteString } from "./sanitizeSVGLite"

describe("sanitizeSVGLiteString", () => {
    it("removes script elements", () => {
        const dirty = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle r="1"/></svg>'
        const clean = sanitizeSVGLiteString(dirty)
        expect(clean).not.toContain("<script")
        expect(clean).toContain("<circle")
    })

    it("removes Adobe Illustrator PGF metadata and dangling encoded text", () => {
        const dirty =
            '<svg xmlns="http://www.w3.org/2000/svg"><switch></switch>\n\t\t\t\n\t\t\t\teJztfXlfGz3S4H4BfwcTAoGATUstqdVAABvb3DfhCCFgbGMcfOEjzzB/7GffqpLU3eZKZubdd5/d\n5Te/yZNWl6SqUt2qdibG9o8yuWrnppbxs146NTGx2quVB53efJpG0xvN5rA/6OHQ1OF0mrGsB0C5\n\t\t\t\n\t\t\n\t</svg>'
        const clean = sanitizeSVGLiteString(dirty)
        expect(clean).not.toContain("eJztfXlf")
    })

    it("removes leading CDATA fragments from broken Illustrator exports", () => {
        const dirty =
            ']&gt;\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0 0"/></svg>'
        expect(hasLeadingSvgCorruption(dirty)).toBe(true)
        const clean = sanitizeSVGLiteString(dirty)
        expect(clean.startsWith("<svg")).toBe(true)
        expect(clean).not.toContain("]&gt;")
        expect(clean).toContain('<path d="M0 0"')
    })
})
