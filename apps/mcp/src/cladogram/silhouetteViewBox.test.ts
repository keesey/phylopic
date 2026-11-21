import { describe, expect, it } from "vitest"
import {
    bottomAlignArtInSquareSlot,
    parseSvgViewBox,
    silhouetteSquareSlot,
} from "@phylopic/diagrams"

describe("parseSvgViewBox", () => {
    it("reads width and height from viewBox", () => {
        expect(
            parseSvgViewBox('<svg viewBox="0 0 1536 662"></svg>'),
        ).toEqual({ width: 1536, height: 662 })
    })
})

describe("silhouetteSquareSlot", () => {
    it("uses equal width and height", () => {
        expect(silhouetteSquareSlot(48)).toEqual({ width: 48, height: 48 })
        expect(silhouetteSquareSlot(40)).toEqual({ width: 40, height: 40 })
    })
})

describe("bottomAlignArtInSquareSlot", () => {
    it("bottom-aligns wide artwork in a square", () => {
        const p = bottomAlignArtInSquareSlot(48, { width: 1536, height: 662 })
        expect(p.width).toBe(48)
        expect(p.height).toBeCloseTo((662 / 1536) * 48)
        expect(p.x).toBe(0)
        expect(p.y).toBeCloseTo(48 - p.height)
    })

    it("bottom-aligns tall artwork in a square", () => {
        const p = bottomAlignArtInSquareSlot(48, { width: 400, height: 800 })
        expect(p.height).toBe(48)
        expect(p.width).toBe(24)
        expect(p.x).toBe(12)
        expect(p.y).toBe(0)
    })
})
