import { describe, expect, it } from "vitest"
import {
    tolColorAtIndex,
    tolColorPalette,
    TOL_DISCRETE_RAINBOW_23,
    TOL_DISCRETE_RAINBOW_DARK,
    TOL_DISCRETE_RAINBOW_ON_WHITE,
} from "./tolColorSchemes.js"

describe("tolColorPalette", () => {
    it("defaults to dark discrete rainbow", () => {
        expect(tolColorPalette()).toEqual(TOL_DISCRETE_RAINBOW_DARK)
        expect(tolColorPalette("darkRainbow")).toEqual(TOL_DISCRETE_RAINBOW_DARK)
        expect(tolColorPalette("rainbow")).toEqual(TOL_DISCRETE_RAINBOW_ON_WHITE)
    })

    it("returns bright qualitative colours", () => {
        expect(tolColorPalette("bright")).toContain("#4477AA")
        expect(tolColorPalette("bright").length).toBe(7)
    })
})

describe("tolColorAtIndex", () => {
    it("wraps indices and defaults to rainbow", () => {
        const palette = tolColorPalette("bright")
        expect(tolColorAtIndex(0)).toBe(TOL_DISCRETE_RAINBOW_DARK[0])
        expect(tolColorAtIndex(palette.length, "bright")).toBe(palette[0])
        expect(tolColorAtIndex(-1, "bright")).toBe(palette[palette.length - 1])
    })

    it("keeps full discrete rainbow list at 23 colours", () => {
        expect(TOL_DISCRETE_RAINBOW_23.length).toBe(23)
    })
})
