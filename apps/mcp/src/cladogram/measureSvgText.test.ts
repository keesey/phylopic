import { describe, expect, it } from "vitest"
import { measureNewickLabel } from "./measureSvgText.js"

describe("measureNewickLabel", () => {
    it("returns positive width for scientific names", () => {
        const m = measureNewickLabel("Homo sapiens")
        expect(m.width).toBeGreaterThan(50)
        expect(m.height).toBeGreaterThan(10)
    })
})
