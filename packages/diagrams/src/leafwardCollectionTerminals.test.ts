import { describe, expect, it } from "vitest"
import { isStrictLineageAncestor, leafwardCollectionTerminals } from "./buildCollectionCladogramTree.js"

describe("isStrictLineageAncestor", () => {
    const lineages = new Map<string, readonly string[]>([
        ["species", ["species", "genus", "family", "root"]],
        ["genus", ["genus", "family", "root"]],
    ])

    it("is true when ancestor appears above the descendant on its lineage", () => {
        expect(isStrictLineageAncestor("family", "species", lineages)).toBe(true)
        expect(isStrictLineageAncestor("genus", "species", lineages)).toBe(true)
    })

    it("is false for the same node or unrelated nodes", () => {
        expect(isStrictLineageAncestor("species", "species", lineages)).toBe(false)
        expect(isStrictLineageAncestor("species", "genus", lineages)).toBe(false)
    })
})

describe("leafwardCollectionTerminals", () => {
    it("drops a collection taxon ancestral to another in the set", () => {
        const lineages = new Map<string, readonly string[]>([
            ["mammalia", ["mammalia", "theria", "root"]],
            ["homo", ["homo", "hominini", "hominidae", "mammalia", "root"]],
            ["echidna", ["echidna", "tachyglossus", "monotremata", "mammalia", "root"]],
        ])
        const terminals = [
            { label: "Mammalia", nodeUuid: "mammalia" },
            { label: "Homo sapiens", nodeUuid: "homo" },
            { label: "Tachyglossus aculeatus", nodeUuid: "echidna" },
        ]
        const { terminals: tips, warnings } = leafwardCollectionTerminals(terminals, lineages)
        expect(tips.map(t => t.nodeUuid)).toEqual(["homo", "echidna"])
        expect(warnings.some(w => w.includes("Mammalia"))).toBe(true)
    })

    it("keeps sibling taxa when neither is ancestral to the other", () => {
        const lineages = new Map<string, readonly string[]>([
            ["a", ["a", "order", "root"]],
            ["b", ["b", "order", "root"]],
        ])
        const terminals = [
            { label: "A", nodeUuid: "a" },
            { label: "B", nodeUuid: "b" },
        ]
        expect(leafwardCollectionTerminals(terminals, lineages).terminals).toHaveLength(2)
    })
})
