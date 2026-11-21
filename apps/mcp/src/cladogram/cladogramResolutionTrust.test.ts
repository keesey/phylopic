import { describe, expect, it, vi } from "vitest"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import {
    assertResolvedAncestorOfDescendants,
    assertTrustedCladogramLabelResolution,
    isCrossHomonymSynonymResolution,
    isNodeOnAnyPeerLineage,
    isTrustedCladogramLabelResolution,
} from "./cladogramResolutionTrust.js"

describe("cladogramResolutionTrust", () => {
    it("accepts PhyloPic synonym variants when title differs from Newick label", () => {
        const result = {
            nodeUuid: "stom",
            title: "Stomiatiformes",
            warnings: ['"Stomiiformes" is another name of PhyloPic node "Stomiatiformes".'],
        }
        expect(isTrustedCladogramLabelResolution("Stomiiformes", result)).toBe(true)
    })

    it("flags non-exact synonym as variant title", () => {
        const result = {
            nodeUuid: "a",
            title: "Physalia",
            warnings: ['"Physalis" is another name of PhyloPic node "Physalia".'],
        }
        expect(isCrossHomonymSynonymResolution("Physalis", result)).toBe(true)
        expect(isTrustedCladogramLabelResolution("Physalis", result)).toBe(true)
    })

    it("rejects filter_name fallback", () => {
        const result = {
            nodeUuid: "b",
            title: "Solanum furcatum",
            warnings: ['No exact PhyloPic title match for "Witheringia"; using "Solanum furcatum" from filter_name "witheringia furcata".'],
        }
        expect(isTrustedCladogramLabelResolution("Witheringia", result)).toBe(false)
    })

    it("rejects Alestidae → Trialestidae-style fallbacks", () => {
        const result = {
            nodeUuid: "tri",
            title: "Trialestidae",
            warnings: [
                'No exact PhyloPic title match for "Alestidae"; using "Trialestidae" from filter_name "trialestidae".',
            ],
        }
        expect(isTrustedCladogramLabelResolution("Alestidae", result)).toBe(false)
        expect(() => assertTrustedCladogramLabelResolution("Alestidae", result)).toThrow(/Untrusted cladogram/)
    })

    it("accepts exact title match", () => {
        const result = { nodeUuid: "c", title: "Panthera", warnings: [] as string[] }
        expect(isTrustedCladogramLabelResolution("Panthera", result)).toBe(true)
    })

    it("rejects synonym resolution that is not an ancestor of resolved children", async () => {
        const PHYSALIA = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        const PLANT_TIP = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        const client = {
            getJson: vi.fn(async (path: string) => {
                if (path === `/nodes/${PLANT_TIP}/lineage`) {
                    return { _embedded: { items: [{ uuid: PLANT_TIP }, { uuid: "plant-clade" }] }, _links: {} }
                }
                throw new Error(path)
            }),
        } as unknown as PhyloPicClient
        await expect(assertResolvedAncestorOfDescendants(client, PHYSALIA, [PLANT_TIP])).rejects.toThrow(
            /not an ancestor/,
        )
    })

    it("does not treat a node as matching only its own lineage", () => {
        const peerUuids = ["beetle", "plant"]
        const lineages = [
            ["beetle", "animal", "life"],
            ["plant", "embryophyte", "life"],
        ] as const
        expect(isNodeOnAnyPeerLineage("beetle", lineages, peerUuids)).toBe(false)
        expect(isNodeOnAnyPeerLineage("plant", lineages, peerUuids)).toBe(false)
        expect(isNodeOnAnyPeerLineage("embryophyte", lineages, peerUuids)).toBe(true)
    })
})
