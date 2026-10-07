import { describe, expect, it } from "vitest"
import {
    isExternalPhylopicMismatch,
    pickFinestSupercladeCandidate,
    type SupercladeCandidate,
} from "./resolveSmallestSuperclade.js"

const cand = (partial: Partial<SupercladeCandidate> & Pick<SupercladeCandidate, "nodeUuid" | "rank" | "source">): SupercladeCandidate => ({
    matchedLabel: "x",
    warnings: [],
    ...partial,
})

describe("resolveSmallestSuperclade helpers", () => {
    it("rejects snail order for fish family Cepolidae", () => {
        expect(isExternalPhylopicMismatch("Cepolidae", "Stylommatophora")).toBe(true)
        expect(isExternalPhylopicMismatch("Cepolidae", "Priacanthiformes")).toBe(false)
    })

    it("prefers genus over order and order over tree ancestor", () => {
        const best = pickFinestSupercladeCandidate([
            cand({ nodeUuid: "a", rank: "order", source: "external_gbif", matchedLabel: "Perciformes" }),
            cand({ nodeUuid: "b", rank: "genus", source: "external_gbif", matchedLabel: "Morone" }),
            cand({ nodeUuid: "c", rank: "order", source: "tree_ancestor", matchedLabel: "Acanthuriformes" }),
        ])
        expect(best?.nodeUuid).toBe("b")
    })
})
