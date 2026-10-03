import { describe, expect, it } from "vitest"
import { collectLabeledSubcladeRootLabels } from "./labeledSubcladeRoots.js"
import type { CladogramTreeNode } from "./types.js"

describe("collectLabeledSubcladeRootLabels", () => {
    it("collects labeled child roots and recurses unlabeled internals", () => {
        const node: CladogramTreeNode = {
            id: "u",
            children: [
                { id: "a", label: "Gorilla", children: [] },
                {
                    id: "b",
                    children: [
                        { id: "c", label: "Homo sapiens", children: [] },
                        { id: "d", label: "Pan", children: [] },
                    ],
                },
            ],
        }
        expect(collectLabeledSubcladeRootLabels(node)).toEqual(["Gorilla", "Homo sapiens", "Pan"])
    })
})
