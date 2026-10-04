import { describe, expect, it } from "vitest"
import {
    isCrossHomonymSynonymResolution,
    isNodeOnAnyPeerLineage,
    isTrustedCladogramLabelResolution,
} from "./cladogramResolutionTrust.js"

describe("cladogramResolutionTrust", () => {
    it("rejects Physalis → Physalia synonym redirect", () => {
        const result = {
            nodeUuid: "a",
            title: "Physalia",
            warnings: ['"Physalis" is another name of PhyloPic node "Physalia".'],
        }
        expect(isCrossHomonymSynonymResolution("Physalis", result)).toBe(true)
        expect(isTrustedCladogramLabelResolution("Physalis", result)).toBe(false)
    })

    it("rejects filter_name fallback", () => {
        const result = {
            nodeUuid: "b",
            title: "Solanum furcatum",
            warnings: ['No exact PhyloPic title match for "Witheringia"; using "Solanum furcatum" from filter_name "witheringia furcata".'],
        }
        expect(isTrustedCladogramLabelResolution("Witheringia", result)).toBe(false)
    })

    it("accepts exact title match", () => {
        const result = { nodeUuid: "c", title: "Panthera", warnings: [] as string[] }
        expect(isTrustedCladogramLabelResolution("Panthera", result)).toBe(true)
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
