import { describe, expect, it } from "vitest"
import {
    mrcaNodeIdForTipIds,
    planRadialCladeRimSilhouetteNodeIds,
} from "./planRadialCladeRimSilhouettes.js"
import type { CladogramTreeNode } from "./types.js"

/** (Acanthuriformes (tip1, (tip2, tip3))) simplified */
const tree: CladogramTreeNode = {
    id: "root",
    label: "Root",
    children: [
        {
            id: "pair",
            children: [
                { id: "t1", label: "Dinoperca", children: [] },
                { id: "t2", label: "Orthopristis", children: [] },
            ],
        },
        {
            id: "sib",
            children: [{ id: "t3", label: "Nibea", children: [] }],
        },
    ],
}

describe("mrcaNodeIdForTipIds", () => {
    it("returns a single tip when only that tip is uncovered", () => {
        const planTree = cloneWithParent(tree)
        const all: typeof planTree[] = []
        collect(planTree, all)
        const byId = new Map(all.map(n => [n.id, n]))
        expect(mrcaNodeIdForTipIds(["t2"], all, byId)).toBe("t2")
    })
})

describe("planRadialCladeRimSilhouetteNodeIds", () => {
    it("prefers the smallest internal clade with an illustration", () => {
        const has = (id: string) => id === "pair"
        const plan = planRadialCladeRimSilhouetteNodeIds(tree, has)
        expect(plan).toEqual(["pair"])
    })

    it("walks up to a larger clade when the smaller one has no image", () => {
        const has = (id: string) => id === "root"
        const plan = planRadialCladeRimSilhouetteNodeIds(tree, has)
        expect(plan).toEqual(["root"])
    })

    it("does not plan a superclade when a subclade is already on the rim", () => {
        const has = (id: string) => id === "pair" || id === "sib" || id === "root"
        const plan = planRadialCladeRimSilhouetteNodeIds(tree, has)
        expect(plan).toEqual(["pair", "sib"])
        expect(plan).not.toContain("root")
    })

    it("does not rim a fork that mixes a direct tip silhouette with an unillustrated sibling", () => {
        const has = (id: string) => id === "pair"
        const plan = planRadialCladeRimSilhouetteNodeIds(tree, has, {
            tipsWithDirectSilhouettes: ["t1"],
        })
        expect(plan).not.toContain("pair")
    })
})

type Mutable = CladogramTreeNode & { parent?: Mutable; children: Mutable[] }

const cloneWithParent = (n: CladogramTreeNode, parent?: Mutable): Mutable => {
    const node: Mutable = {
        id: n.id,
        ...(n.label !== undefined ? { label: n.label } : {}),
        ...(n.branchLength !== undefined ? { branchLength: n.branchLength } : {}),
        children: [],
        parent,
    }
    node.children = n.children.map(c => cloneWithParent(c, node))
    return node
}

const collect = (node: Mutable, out: Mutable[]) => {
    out.push(node)
    for (const c of node.children) collect(c, out)
}
