import { describe, expect, it } from "vitest"
import { labelAncestralCladogramNodes } from "./buildCollectionCladogramTree.js"

describe("labelAncestralCladogramNodes", () => {
    it("adds PhyloPic titles to unlabeled internal nodes", () => {
        const root = {
            id: "internal",
            children: [{ id: "tip", label: "Homo sapiens", children: [] }],
        }
        const labeled = labelAncestralCladogramNodes(
            root,
            { internal: "hominidae-uuid", tip: "homo-uuid" },
            new Map([["hominidae-uuid", "Hominidae"]]),
        )
        expect(labeled.label).toBe("Hominidae")
        expect(labeled.children[0]!.label).toBe("Homo sapiens")
    })

    it("leaves internals unlabeled when no title is known", () => {
        const root = {
            id: "internal",
            children: [{ id: "tip", label: "A", children: [] }],
        }
        const labeled = labelAncestralCladogramNodes(root, { internal: "x", tip: "y" }, new Map())
        expect(labeled.label).toBeUndefined()
    })
})
