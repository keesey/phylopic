import { describe, expect, it } from "vitest"
import { buildRadialCladogramLayout } from "./buildRadialCladogramLayout.js"
import { RADIAL_CLADE_KEY_TIP_THRESHOLD } from "./radialCladogramLayout.js"

const tip = (id: string, label: string) => ({ id, label, children: [] as const })

describe("buildRadialCladogramLayout", () => {
    it("uses labeled-tip mode at or below the clade-key threshold", () => {
        const tips = Array.from({ length: RADIAL_CLADE_KEY_TIP_THRESHOLD }, (_, i) =>
            tip(`t${i}`, `Species_${i}`),
        )
        const root = { id: "r", label: "Root", children: tips }
        const geo = buildRadialCladogramLayout(root, { tipCount: tips.length })
        expect(geo.cladeKeyMode).toBe(false)
        expect(geo.tipLabels.length).toBe(tips.length)
        expect(geo.edges.length).toBeGreaterThan(0)
    })

    it("uses clade-key mode above the threshold", () => {
        const tips = Array.from({ length: RADIAL_CLADE_KEY_TIP_THRESHOLD + 1 }, (_, i) =>
            tip(`t${i}`, `Species_${i}`),
        )
        const root = { id: "r", label: "Root", children: tips }
        const geo = buildRadialCladogramLayout(root, { tipCount: tips.length })
        expect(geo.cladeKeyMode).toBe(true)
        expect(geo.tipLabels.length).toBe(0)
    })

})
