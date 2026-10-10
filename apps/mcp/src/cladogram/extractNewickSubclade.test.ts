import { describe, expect, it } from "vitest"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import { findCladogramNodeByLabel, newickSubcladeByLabel } from "./extractNewickSubclade.js"
import { parseNewickToTree } from "./parseNewick.js"

describe("cladogramTreeToNewick branch lengths", () => {
    it("emits :length on child edges", () => {
        const newick = cladogramTreeToNewick({
            id: "r",
            label: "Root",
            children: [
                { id: "a", label: "A", branchLength: 0.1, children: [] },
                { id: "b", label: "B", branchLength: 0.2, children: [] },
            ],
        })
        expect(newick).toBe("(A:0.1,B:0.2)Root")
    })
})

describe("newickSubcladeByLabel", () => {
    it("preserves branch lengths under the extracted root", () => {
        const source = "((A:1,B:2)Inner:3,(C:4)Other:5)Root;"
        const { root } = parseNewickToTree(source)
        const sub = newickSubcladeByLabel(root, "Inner")
        expect(sub).toBe("(A:1,B:2)Inner;")
        expect(findCladogramNodeByLabel(root, "Missing")).toBeUndefined()
    })
})
