import { describe, expect, it } from "vitest"
import {
    assignBasicCladogramColumnsFromTree,
    assignBasicCladogramRails,
    DEFAULT_BASIC_CLADOGRAM_THEME,
    minTipRailSeparation,
    nodeColumnExtent,
    verticalGutterOffset,
    type BasicNodeMeasures,
    type RailLayoutNode,
} from "./basicCladogramLayout.js"

const theme = DEFAULT_BASIC_CLADOGRAM_THEME

const tipWithImage = (label: string, labelW: number): BasicNodeMeasures => ({
    hasImage: true,
    imageWidth: 48,
    imageHeight: 48,
    hasLabel: true,
    labelWidth: labelW,
    labelHeight: 14,
    isTip: true,
})

describe("nodeColumnExtent", () => {
    it("uses measured label width, not character guesses", () => {
        const m: BasicNodeMeasures = {
            hasImage: true,
            imageWidth: 40,
            imageHeight: 40,
            hasLabel: true,
            labelWidth: 132,
            labelHeight: 14,
            isTip: false,
        }
        expect(nodeColumnExtent(m, theme)).toBeGreaterThanOrEqual(132 + 2 * theme.gutterMargin)
    })

    it("leaves gutter margin after label-only internal nodes", () => {
        const m: BasicNodeMeasures = {
            hasImage: false,
            imageWidth: 0,
            imageHeight: 0,
            hasLabel: true,
            labelWidth: 48,
            labelHeight: 14,
            isTip: false,
        }
        expect(verticalGutterOffset(m, theme)).toBe(48 + theme.gutterMargin)
    })

    it("starts an empty node's children past its vertical connector", () => {
        const empty = {
            hasImage: false,
            imageWidth: 0,
            imageHeight: 0,
            hasLabel: false,
            labelWidth: 0,
            labelHeight: 0,
            isTip: false,
        }
        expect(nodeColumnExtent(empty, theme)).toBe(verticalGutterOffset(empty, theme) + theme.gutterMargin)
    })
})

describe("assignBasicCladogramRails", () => {
    it("packs consecutive tips using measured footprints", () => {
        const root: RailLayoutNode = {
            children: [
                { label: "A", children: [] },
                { label: "B", children: [] },
            ],
        }
        const measures = (n: RailLayoutNode) => tipWithImage(n.label ?? "", 40)
        assignBasicCladogramRails(root, measures, theme)
        const gap = root.children[1]!.railY! - root.children[0]!.railY!
        expect(gap).toBe(minTipRailSeparation(root.children[0]!, root.children[1]!, measures, theme))
        expect(gap).toBeLessThan(120)
    })

    it("places internal rail at mean of child rails", () => {
        const root: RailLayoutNode = {
            label: "Root",
            children: [
                { label: "A", children: [] },
                { label: "B", children: [] },
            ],
        }
        assignBasicCladogramRails(root, n => tipWithImage(n.label ?? "", 40), theme)
        const mean =
            (root.children[0]!.railY! + root.children[1]!.railY!) / 2
        expect(root.railY).toBe(mean)
    })
})

describe("assignBasicCladogramColumnsFromTree", () => {
    it("does not widen a cousin branch for a long sibling subtree label", () => {
        type N = { x?: number; label?: string; children: N[] }
        const root: N = {
            children: [
                {
                    label: "Wide",
                    children: [{ label: "Very long tip name here", children: [] }],
                },
                {
                    label: "Narrow",
                    children: [{ label: "Short", children: [] }],
                },
            ],
        }
        const measures = (n: N): BasicNodeMeasures => {
            const tip = n.children.length === 0
            const w = n.label === "Very long tip name here" ? 160 : n.label === "Short" ? 40 : 50
            return {
                hasImage: false,
                imageWidth: 0,
                imageHeight: 0,
                hasLabel: Boolean(n.label),
                labelWidth: w,
                labelHeight: 14,
                isTip: tip,
            }
        }
        assignBasicCladogramColumnsFromTree(root, measures, theme)
        const wideTip = root.children[0]!.children[0]!
        const narrowTip = root.children[1]!.children[0]!
        expect(narrowTip.x!).toBeLessThan(wideTip.x! + 200)
        expect(narrowTip.x!).toBeGreaterThan(root.children[1]!.x!)
    })

    it("places children of an unlabeled, unillustrated root past the root's vertical connector", () => {
        type N = { x?: number; label?: string; children: N[] }
        const root: N = {
            children: [
                { label: "Bovine", children: [] },
                { children: [{ label: "Hylobates", children: [] }, { label: "Pongo", children: [] }] },
                { label: "Rodent", children: [] },
            ],
        }
        const measures = (n: N): BasicNodeMeasures => {
            const tip = n.children.length === 0
            return {
                hasImage: tip,
                imageWidth: tip ? 52 : 0,
                imageHeight: tip ? 52 : 0,
                hasLabel: Boolean(n.label),
                labelWidth: n.label ? 60 : 0,
                labelHeight: 14,
                isTip: tip,
            }
        }
        assignBasicCladogramColumnsFromTree(root, measures, theme)
        const rootGutter = root.x! + verticalGutterOffset(measures(root), theme)
        for (const child of root.children) {
            expect(child.x!).toBeGreaterThan(rootGutter)
        }
    })
})
