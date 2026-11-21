import { describe, expect, it } from "vitest"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import { parseNewickToTree } from "./parseNewick.js"

describe("cladogramTreeToNewick", () => {
    it("emits unlabeled internal groups and labeled tips", () => {
        const newick = cladogramTreeToNewick({
            id: "r",
            children: [
                {
                    id: "a",
                    children: [
                        { id: "1", label: "hops", children: [] },
                        { id: "2", label: "rice", children: [] },
                    ],
                },
                {
                    id: "b",
                    children: [
                        { id: "3", label: "seahorses", children: [] },
                        {
                            id: "4",
                            children: [
                                { id: "5", label: "humans", children: [] },
                                { id: "6", label: "toucans", children: [] },
                            ],
                        },
                    ],
                },
            ],
        })
        expect(newick).toBe("((hops,rice),(seahorses,(humans,toucans)))")
    })

    it("round-trips branch lengths", () => {
        const source = "((a:0.5,b:0.25)Clade:1.5);"
        const { root } = parseNewickToTree(source)
        expect(cladogramTreeToNewick(root)).toBe("((a:0.5,b:0.25)Clade:1.5)")
    })
})
