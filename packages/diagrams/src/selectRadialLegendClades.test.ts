import { describe, expect, it } from "vitest"
import {
    assignRadialCladogramLayout,
    DEFAULT_RADIAL_CLADOGRAM_THEME,
    radialLegendRingRadius,
} from "./radialCladogramLayout.js"
import {
    countTipsUnderLegendNode,
    radialLegendMinSpanRadFromSlotWidth,
    selectRadialLegendClades,
} from "./selectRadialLegendClades.js"

const tips = (labels: string[]) => labels.map(label => ({ label, children: [] as const }))

const tree = () => {
    return {
        label: "Root",
        children: [
            {
                label: "CladeA",
                children: [
                    { label: "SubA1", children: tips(["t1", "t2", "t3", "t4", "t5", "t6"]) },
                    { label: "SubA2", children: tips(["t7", "t8", "t9", "t10", "t11", "t12"]) },
                ],
            },
            {
                label: "CladeB",
                children: [{ label: "SubB1", children: tips(["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"]) }],
            },
        ],
    }
}

const layoutTree = () => {
    const root = tree()
    const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 280, silhouetteOutset: 52 }
    assignRadialCladogramLayout(root, theme)
    return { root, legendRingRadius: radialLegendRingRadius(theme) }
}

const selectOptions = (legendRingRadius: number) => ({
    legendRingRadius,
    legendSilhouetteWidth: 44,
    minLegendSpanRad: 0,
    maxLegendSpanDeg: 180,
    minDepth: 2,
})

describe("radialLegendMinSpanRadFromSlotWidth", () => {
    it("converts arc length to central angle", () => {
        expect(radialLegendMinSpanRadFromSlotWidth(44, 332)).toBeCloseTo(44 / 332)
    })
})

describe("selectRadialLegendClades", () => {
    it("prefers deeper clades and skips nested selections", () => {
        const { root, legendRingRadius } = layoutTree()
        const legend = selectRadialLegendClades(root, selectOptions(legendRingRadius))
        const labels = legend.map(n => n.label)
        expect(labels).toContain("SubA1")
        expect(labels).toContain("SubA2")
        expect(labels).toContain("SubB1")
        expect(labels).not.toContain("CladeA")
        expect(labels).not.toContain("Root")
    })

    it("excludes the whole tree and shallow nodes when minDepth is 2", () => {
        const { root, legendRingRadius } = layoutTree()
        const legend = selectRadialLegendClades(root, {
            ...selectOptions(legendRingRadius),
            minLegendSpanRad: 0,
        })
        expect(legend.some(n => n.label === "Root")).toBe(false)
        expect(legend.some(n => n.label === "CladeA")).toBe(false)
    })

    it("drops clades whose angular span is narrower than one legend slot", () => {
        const big: ReturnType<typeof tree> = {
            label: "Root",
            children: [
                {
                    label: "Tiny",
                    children: tips(["only"]),
                },
                {
                    label: "Big",
                    children: tips(Array.from({ length: 99 }, (_, i) => `x${i}`)),
                },
            ],
        }
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 280, silhouetteOutset: 52 }
        assignRadialCladogramLayout(big, theme)
        const ringR = radialLegendRingRadius(theme)
        const minSpan = radialLegendMinSpanRadFromSlotWidth(44, ringR)
        const legend = selectRadialLegendClades(big, {
            legendRingRadius: ringR,
            legendSilhouetteWidth: 44,
            minDepth: 1,
            maxLegendSpanDeg: 360,
        })
        expect(legend.some(n => n.label === "Tiny")).toBe(false)
        expect(legend.some(n => n.label === "Big")).toBe(true)
        expect(minSpan).toBeGreaterThan((1 / 100) * 2 * Math.PI)
    })

    it("excludes clades wider than maxLegendSpanDeg", () => {
        const mixed = {
            label: "Root",
            children: [
                { label: "Wide", children: tips(Array.from({ length: 90 }, (_, i) => `w${i}`)) },
                { label: "Narrow", children: tips(["a", "b", "c", "d", "e"]) },
            ],
        }
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 280, silhouetteOutset: 52 }
        assignRadialCladogramLayout(mixed, theme)
        const ringR = radialLegendRingRadius(theme)
        const legend = selectRadialLegendClades(mixed, {
            legendRingRadius: ringR,
            minLegendSpanRad: 0,
            maxLegendSpanDeg: 45,
            minDepth: 1,
        })
        expect(legend.some(n => n.label === "Wide")).toBe(false)
        expect(legend.some(n => n.label === "Narrow")).toBe(true)
    })

    it("counts tips under a node", () => {
        expect(countTipsUnderLegendNode(tree())).toBe(20)
    })

    it("qualifies narrow wedges by silhouette width even when a clade label is long", () => {
        const longName = "Pseudopercisomus supercalifragilisticexpialidocious"
        const narrow: ReturnType<typeof tree> = {
            label: "Root",
            children: [
                {
                    label: longName,
                    children: tips(Array.from({ length: 8 }, (_, i) => `n${i}`)),
                },
                {
                    label: "Other",
                    children: tips(Array.from({ length: 92 }, (_, i) => `o${i}`)),
                },
            ],
        }
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 280, silhouetteOutset: 52 }
        assignRadialCladogramLayout(narrow, theme)
        const ringR = radialLegendRingRadius(theme)
        const legendDefault = selectRadialLegendClades(narrow, {
            legendRingRadius: ringR,
            legendSilhouetteWidth: 44,
            minDepth: 1,
            maxLegendSpanDeg: 45,
        })
        expect(legendDefault.some(n => n.label === longName)).toBe(true)

        const legendLabelFloor = selectRadialLegendClades(narrow, {
            legendRingRadius: ringR,
            legendSilhouetteWidth: 44,
            longestLegendLabelWidth: 400,
            minDepth: 1,
            maxLegendSpanDeg: 45,
        })
        expect(legendLabelFloor.some(n => n.label === longName)).toBe(false)
    })
})
