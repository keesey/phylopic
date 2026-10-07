import { describe, expect, it } from "vitest"
import { countTipsUnderLegendNode, selectRadialLegendClades } from "./selectRadialLegendClades.js"

const tree = () => {
    const tips = (labels: string[]) => labels.map(label => ({ label, children: [] as const }))
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

describe("selectRadialLegendClades", () => {
    it("prefers deeper clades and skips nested selections", () => {
        const root = tree()
        const legend = selectRadialLegendClades(root, { minTipsUnder: 6, maxLegendClades: 10, minDepth: 2 })
        const labels = legend.map(n => n.label)
        expect(labels).toContain("SubA1")
        expect(labels).toContain("SubA2")
        expect(labels).toContain("SubB1")
        expect(labels).not.toContain("CladeA")
        expect(labels).not.toContain("Root")
    })

    it("excludes the whole tree and shallow nodes when minDepth is 2", () => {
        const root = tree()
        const legend = selectRadialLegendClades(root, { minTipsUnder: 4, minDepth: 2 })
        expect(legend.some(n => n.label === "Root")).toBe(false)
        expect(legend.some(n => n.label === "CladeA")).toBe(false)
    })

    it("counts tips under a node", () => {
        expect(countTipsUnderLegendNode(tree())).toBe(20)
    })
})
