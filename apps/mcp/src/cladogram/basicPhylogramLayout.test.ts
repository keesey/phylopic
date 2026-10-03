import { describe, expect, it } from "vitest"
import {
    assignBasicPhylogramColumnsFromTree,
    assignBasicPhylogramRails,
    DEFAULT_BASIC_PHYLOGRAM_THEME,
    minTipRailSeparation,
    nodeColumnExtent,
    verticalGutterOffset,
    type BasicNodeMeasures,
    type RailLayoutNode,
} from "./basicPhylogramLayout.js"

const theme = DEFAULT_BASIC_PHYLOGRAM_THEME

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

    it("returns 0 for empty nodes", () => {
        expect(
            nodeColumnExtent(
                {
                    hasImage: false,
                    imageWidth: 0,
                    imageHeight: 0,
                    hasLabel: false,
                    labelWidth: 0,
                    labelHeight: 0,
                    isTip: false,
                },
                theme,
            ),
        ).toBe(0)
    })
})

describe("assignBasicPhylogramRails", () => {
    it("packs consecutive tips using measured footprints", () => {
        const root: RailLayoutNode = {
            children: [
                { label: "A", children: [] },
                { label: "B", children: [] },
            ],
        }
        const measures = (n: RailLayoutNode) => tipWithImage(n.label ?? "", 40)
        assignBasicPhylogramRails(root, measures, theme)
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
        assignBasicPhylogramRails(root, n => tipWithImage(n.label ?? "", 40), theme)
        const mean =
            (root.children[0]!.railY! + root.children[1]!.railY!) / 2
        expect(root.railY).toBe(mean)
    })
})

describe("assignBasicPhylogramColumnsFromTree", () => {
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
        assignBasicPhylogramColumnsFromTree(root, measures, theme)
        const wideTip = root.children[0]!.children[0]!
        const narrowTip = root.children[1]!.children[0]!
        expect(narrowTip.x!).toBeLessThan(wideTip.x! + 200)
        expect(narrowTip.x!).toBeGreaterThan(root.children[1]!.x!)
    })
})
