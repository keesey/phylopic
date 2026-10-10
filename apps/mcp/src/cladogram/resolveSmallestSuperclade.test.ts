import { describe, expect, it } from "vitest"
import {
    filterSupercladeCandidatesWithinTreeRoot,
    isExternalPhylopicMismatch,
    isPhylopicSupercladeOfScope,
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

    it("drops candidates above the Newick root scope before picking finest", async () => {
        const siluriformes = "11111111-1111-4111-8111-111111111111"
        const bilateria = "22222222-2222-4222-8222-222222222222"
        const akysidae = "33333333-3333-4333-8333-333333333333"
        const client = {
            getJson: async (path: string) => {
                if (path === `/nodes/${siluriformes}/lineage`) {
                    return {
                        _embedded: { items: [{ uuid: siluriformes }, { uuid: bilateria }] },
                        _links: { next: null },
                    }
                }
                throw new Error(`unexpected ${path}`)
            },
        } as unknown as Parameters<typeof isPhylopicSupercladeOfScope>[0]

        expect(await isPhylopicSupercladeOfScope(client, bilateria, siluriformes)).toBe(true)
        expect(await isPhylopicSupercladeOfScope(client, akysidae, siluriformes)).toBe(false)
        expect(await isPhylopicSupercladeOfScope(client, siluriformes, siluriformes)).toBe(false)

        const scoped = await filterSupercladeCandidatesWithinTreeRoot(
            client,
            [
                cand({ nodeUuid: bilateria, rank: "phylum", source: "external_search" }),
                cand({ nodeUuid: akysidae, rank: "family", source: "external_gbif" }),
            ],
            siluriformes,
        )
        const best = pickFinestSupercladeCandidate(scoped)
        expect(best?.nodeUuid).toBe(akysidae)
    })
})
