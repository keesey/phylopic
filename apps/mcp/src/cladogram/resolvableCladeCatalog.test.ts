import { describe, expect, it } from "vitest"
import { formatSmallestResolvableSupercladeReport } from "./resolvableCladeCatalog.js"

describe("formatSmallestResolvableSupercladeReport", () => {
    it("lists only SRC assignments with node id, label, and PhyloPic title", () => {
        const lines = formatSmallestResolvableSupercladeReport([
            {
                nodeId: "t1",
                newickLabel: "Centropyge",
                phylopicUuid: "uuid-a",
                phylopicTitle: "Centropyge",
                rank: "genus",
                method: "smallest_resolvable_superclade",
            },
            {
                nodeId: "clade",
                newickLabel: "Acanthuroidei",
                phylopicUuid: "uuid-b",
                phylopicTitle: "Acanthuroidei",
                method: "trusted_label",
            },
        ])
        expect(lines[0]).toBe("Smallest resolvable superclade (SRC): 1 node(s)")
        expect(lines[1]).toContain("t1")
        expect(lines[1]).toContain("Centropyge")
        expect(lines[1]).toContain("[genus]")
    })

    it("reports none when no SRC nodes", () => {
        expect(
            formatSmallestResolvableSupercladeReport([
                {
                    nodeId: "r",
                    phylopicUuid: "u",
                    method: "descendant_mrca",
                },
            ]),
        ).toEqual(["Smallest resolvable superclade (SRC): none"])
    })
})
