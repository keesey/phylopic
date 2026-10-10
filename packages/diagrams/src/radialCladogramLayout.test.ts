import { describe, expect, it } from "vitest"
import {
    assignRadialCladogramLayout,
    cloneRadialLayoutTree,
    collectRadialTipsInOrder,
    polarToCartesian,
    radialAncestralArcPath,
    radialBranchEdgePath,
    radialBranchPoint,
    radialNodeRadius,
    radialInnerRingLabelTextPlacement,
    radialInnerRingSilhouetteRotationDeg,
    cladeRimBearingRad,
    meanAngleRad,
    radialSilhouetteRotationDeg,
    radialSilhouetteOutwardOffset,
    radialLabelTextPlacement,
    radialBranchTipRadiusForLabels,
    radialMaxTipLabelWidth,
    radialOuterLayoutViewBoxHalfExtent,
    radialNodeShowsLabel,
    radialNodeShowsSilhouette,
    DEFAULT_RADIAL_CLADOGRAM_THEME,
    radialRadiusScaleFromLayout,
} from "./radialCladogramLayout.js"

describe("assignRadialCladogramLayout", () => {
    it("places three tip siblings in contiguous sectors on a full circle", () => {
        const theme = {
            ...DEFAULT_RADIAL_CLADOGRAM_THEME,
            sweepAngle: 2 * Math.PI,
            startAngle: -Math.PI / 2,
        }
        const root = cloneRadialLayoutTree({
            children: [{ label: "a", children: [] }, { label: "b", children: [] }, { label: "c", children: [] }],
        })
        const { root: laid, maxDepth, tipCount } = assignRadialCladogramLayout(root, theme)
        expect(tipCount).toBe(3)
        expect(maxDepth).toBe(1)
        const third = theme.sweepAngle / 3
        expect(laid.children[0]!.angle).toBeCloseTo(theme.startAngle + third / 2)
        expect(laid.children[1]!.angle).toBeCloseTo(theme.startAngle + third + third / 2)
        expect(laid.children[2]!.angle).toBeCloseTo(theme.startAngle + 2 * third + third / 2)
    })

    it("keeps each clade in one contiguous arc (angular order matches Newick tip order)", () => {
        const root = cloneRadialLayoutTree({
            children: [
                {
                    label: "G1",
                    children: [{ label: "a", children: [] }, { label: "b", children: [] }],
                },
                {
                    label: "G2",
                    children: [{ label: "c", children: [] }, { label: "d", children: [] }],
                },
            ],
        })
        const { root: laid } = assignRadialCladogramLayout(root)
        const dfsTips = collectRadialTipsInOrder(laid)
        const byAngle = [...dfsTips].sort((x, y) => x.angle! - y.angle!)
        expect(byAngle.map(t => t.label)).toEqual(["a", "b", "c", "d"])
    })

    it("places internal node angle at mean of child bearings", () => {
        const root = cloneRadialLayoutTree({
            children: [
                {
                    children: [{ label: "left", children: [] }, { label: "left2", children: [] }],
                },
                { label: "right", children: [] },
            ],
        })
        const { root: laid } = assignRadialCladogramLayout(root)
        const internal = laid.children[0]!
        const left = internal.children[0]!.angle!
        const left2 = internal.children[1]!.angle!
        expect(internal.angle).toBeCloseTo((left + left2) / 2)
    })

    it("cladeRimBearingRad includes sibling tip branches under the same parent", () => {
        type N = ReturnType<typeof cloneRadialLayoutTree> & { parent?: N }
        const root = cloneRadialLayoutTree({
            children: [
                { label: "Akysidae", children: [] },
                {
                    children: [
                        { label: "Liobagrus geumgangensis", children: [] },
                        { label: "Glyptothorax quadriocellatus", children: [] },
                    ],
                },
            ],
        }) as N
        const pair = root.children[1] as N
        root.children.forEach(c => {
            ;(c as N).parent = root
            c.children.forEach(g => {
                ;(g as N).parent = c as N
            })
        })
        const { root: laid } = assignRadialCladogramLayout(root)
        const laidPair = laid.children[1]!
        const laidRoot = laid
        const twoTipMean = meanAngleRad(laidPair.children.map(c => c.angle ?? 0))
        expect(cladeRimBearingRad(laidPair as N)).toBeCloseTo(laidRoot.angle!)
        expect(cladeRimBearingRad(laidPair as N)).not.toBeCloseTo(twoTipMean)
    })

    it("scales branch radius by depth", () => {
        const root = cloneRadialLayoutTree({
            children: [
                {
                    children: [{ label: "tip", children: [] }],
                },
            ],
        })
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 100 }
        const { root: laid, maxDepth } = assignRadialCladogramLayout(root, theme)
        const tip = laid.children[0]!.children[0]!
        const internal = laid.children[0]!
        expect(radialBranchPoint(laid, maxDepth, theme).x).toBeCloseTo(0)
        expect(radialBranchPoint(laid, maxDepth, theme).y).toBeCloseTo(0)
        expect(radialBranchPoint(internal, maxDepth, theme).y).toBeCloseTo(50)
        expect(radialBranchPoint(tip, maxDepth, theme).y).toBeCloseTo(100)
    })

    it("places shallow tips on the full tip circle, not at depth-scaled radius", () => {
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 200 }
        const root = cloneRadialLayoutTree({
            children: [
                { label: "short", children: [] },
                {
                    children: [
                        {
                            children: [{ label: "deep", children: [] }],
                        },
                    ],
                },
            ],
        })
        const { root: laid, maxDepth } = assignRadialCladogramLayout(root, theme)
        const shortTip = laid.children[0]!
        const deepTip = laid.children[1]!.children[0]!.children[0]!
        expect(maxDepth).toBeGreaterThan(1)
        expect(shortTip.depth).toBe(1)
        expect(radialNodeRadius(shortTip, maxDepth, theme)).toBe(200)
        expect(radialNodeRadius(deepTip, maxDepth, theme)).toBe(200)
    })
})

describe("radial display rules", () => {
    it("only tips show labels and silhouettes", () => {
        const internal: { children: { children: [] }[] } = { children: [{ children: [] }] }
        expect(radialNodeShowsLabel(internal)).toBe(false)
        expect(radialNodeShowsSilhouette(internal)).toBe(false)
        const tip = { children: [] as { children: [] }[] }
        expect(radialNodeShowsLabel(tip)).toBe(true)
        expect(radialNodeShowsSilhouette(tip)).toBe(true)
    })
})

describe("radialLabelTextPlacement", () => {
    it("uses start anchor on the right and flipped end anchor on the left", () => {
        expect(radialLabelTextPlacement(0)).toEqual({ rotationDeg: 0, textAnchor: "start" })
        expect(radialLabelTextPlacement(Math.PI / 2)).toEqual({ rotationDeg: 90, textAnchor: "start" })
        expect(radialLabelTextPlacement(Math.PI)).toEqual({ rotationDeg: 360, textAnchor: "end" })
    })
})

describe("radialInnerRingLabelTextPlacement", () => {
    it("centers on the spoke, 90° clockwise from tip labels, bottom half flipped", () => {
        expect(radialInnerRingLabelTextPlacement(0)).toEqual({ rotationDeg: 90, textAnchor: "middle" })
        expect(radialInnerRingLabelTextPlacement(Math.PI / 2)).toEqual({
            rotationDeg: 360,
            textAnchor: "middle",
        })
        expect(radialInnerRingLabelTextPlacement(-Math.PI / 2)).toEqual({
            rotationDeg: 0,
            textAnchor: "middle",
        })
    })
})

describe("radialSilhouetteOutwardOffset", () => {
    it("shifts bottom-half silhouettes outward along the spoke by artwork height", () => {
        const h = 40
        expect(radialSilhouetteOutwardOffset(-Math.PI / 2, h)).toEqual({ dx: 0, dy: 0 })
        expect(radialSilhouetteOutwardOffset(0, h)).toEqual({ dx: 0, dy: 0 })
        const theta = Math.PI / 2
        const o = radialSilhouetteOutwardOffset(theta, h)
        expect(o.dx).toBeCloseTo(0)
        expect(o.dy).toBeCloseTo(h)
    })
})

describe("radialSilhouetteRotationDeg", () => {
    it("flips silhouettes on the bottom half like inner-ring clade labels", () => {
        expect(radialSilhouetteRotationDeg(0)).toBe(90)
        expect(radialSilhouetteRotationDeg(-Math.PI / 2)).toBe(0)
        expect(radialSilhouetteRotationDeg(Math.PI / 2)).toBe(
            radialInnerRingLabelTextPlacement(Math.PI / 2).rotationDeg,
        )
        expect(radialInnerRingSilhouetteRotationDeg(Math.PI / 2)).toBe(radialSilhouetteRotationDeg(Math.PI / 2))
    })
})

describe("branch-length radius mode", () => {
    it("scales the longest root-to-tip path to tipRadius", () => {
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 100 }
        const root = cloneRadialLayoutTree({
            children: [
                { label: "short", branchLength: 1, children: [] },
                { label: "long", branchLength: 3, children: [] },
            ],
        })
        const layout = assignRadialCladogramLayout(root, theme, { radiusMode: "branchLength" })
        const scale = radialRadiusScaleFromLayout(layout)
        expect(layout.maxRootToTipPathLength).toBe(3)
        expect(radialNodeRadius(root.children[0]!, layout.maxDepth, theme, scale)).toBeCloseTo(100 / 3)
        expect(radialNodeRadius(root.children[1]!, layout.maxDepth, theme, scale)).toBeCloseTo(100)
    })
})

describe("radialBranchTipRadiusForLabels", () => {
    it("insets the branch circle by label band width inside the outer layout radius", () => {
        const outer = 500
        const labelW = 120
        const branchR = radialBranchTipRadiusForLabels(outer, DEFAULT_RADIAL_CLADOGRAM_THEME, labelW)
        const labelBand = DEFAULT_RADIAL_CLADOGRAM_THEME.labelOutset + labelW
        expect(branchR).toBe(outer - labelBand)
        expect(branchR + labelBand).toBe(outer)
    })
})

describe("radialOuterLayoutViewBoxHalfExtent", () => {
    it("pads beyond the outer silhouette ring", () => {
        expect(radialOuterLayoutViewBoxHalfExtent(300, 40, 24)).toBe(364)
    })
})

describe("radialMaxTipLabelWidth", () => {
    it("returns zero when no labels", () => {
        expect(radialMaxTipLabelWidth([{ label: undefined }, { label: "" }])).toBe(0)
    })
})

describe("radialBranchEdgePath", () => {
    it("uses only radial segments (constant θ) for parent→child links", () => {
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 100 }
        const root = cloneRadialLayoutTree({
            children: [
                {
                    children: [
                        { label: "a", children: [] },
                        {
                            children: [{ label: "b", children: [] }],
                        },
                    ],
                },
            ],
        })
        const { root: laid, maxDepth } = assignRadialCladogramLayout(root, theme)
        const fork = laid.children[0]!
        const tipA = fork.children[0]!
        const sub = fork.children[1]!
        const tipB = sub.children[0]!
        for (const d of [
            radialBranchEdgePath(laid, fork, maxDepth, theme),
            radialBranchEdgePath(fork, tipA, maxDepth, theme),
            radialBranchEdgePath(fork, sub, maxDepth, theme),
            radialBranchEdgePath(sub, tipB, maxDepth, theme),
        ]) {
            expect(d).not.toContain(" A ")
            expect(d).toMatch(/^M .* L .*$/)
        }
        const tipPath = radialBranchEdgePath(fork, tipA, maxDepth, theme)
        const end = polarToCartesian(100, tipA.angle!)
        expect(tipPath).toContain(`L ${end.x} ${end.y}`)
    })
})

describe("radialAncestralArcPath", () => {
    it("spans immediate child bearings on the node circle", () => {
        const theme = { ...DEFAULT_RADIAL_CLADOGRAM_THEME, tipRadius: 100 }
        const root = cloneRadialLayoutTree({
            children: [
                {
                    children: [{ label: "a", children: [] }, { label: "b", children: [] }],
                },
            ],
        })
        const { root: laid, maxDepth } = assignRadialCladogramLayout(root, theme)
        const fork = laid.children[0]!
        const arc = radialAncestralArcPath(fork, maxDepth, theme)
        expect(arc).toContain(" A ")
        expect(radialAncestralArcPath(laid, maxDepth, theme)).toBeNull()
    })
})
