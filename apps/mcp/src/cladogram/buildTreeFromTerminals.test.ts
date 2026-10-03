import { describe, expect, it } from "vitest"
import {
    buildTreeFromTerminalLineages,
    childTowardTip,
    concestorNodeUuid,
} from "./buildTreeFromTerminals.js"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"

describe("concestorNodeUuid", () => {
    it("walks past nodes that do not branch among selected tips", () => {
        const tips = [
            { label: "A", nodeUuid: "a" },
            { label: "B", nodeUuid: "b" },
        ]
        const lineages = new Map<string, readonly string[]>([
            ["a", ["a", "y", "r"]],
            ["b", ["b", "y", "r"]],
        ])
        expect(concestorNodeUuid("r", tips, lineages)).toBe("y")
    })
})

describe("childTowardTip", () => {
    it("returns the next node toward the tip", () => {
        const lineage = ["tip", "mid", "root"]
        expect(childTowardTip(lineage, "root")).toBe("mid")
        expect(childTowardTip(lineage, "mid")).toBe("tip")
        expect(childTowardTip(lineage, "tip")).toBeNull()
    })
})

describe("buildTreeFromTerminalLineages", () => {
    it("builds a multifurcating tree from shared lineages", () => {
        const terminals = [
            { label: "A", nodeUuid: "a" },
            { label: "B", nodeUuid: "b" },
        ] as const
        const lineages = new Map<string, readonly string[]>([
            ["a", ["a", "p", "r", "life"]],
            ["b", ["b", "p", "r", "life"]],
        ])
        const { root, nodeUuidByTreeId } = buildTreeFromTerminalLineages([...terminals], lineages)
        expect(root.children).toHaveLength(2)
        expect(root.children.map(c => c.label)).toEqual(["A", "B"])
        expect(nodeUuidByTreeId[root.id]).toBe("p")
    })

    it("collapses unary PhyloPic chains to concestors only", () => {
        const terminals = [
            { label: "A", nodeUuid: "a" },
            { label: "B", nodeUuid: "b" },
        ] as const
        const lineages = new Map<string, readonly string[]>([
            ["a", ["a", "x", "y", "r", "life"]],
            ["b", ["b", "x", "y", "r", "life"]],
        ])
        const { root } = buildTreeFromTerminalLineages([...terminals], lineages)
        const count = (n: typeof root): number => 1 + n.children.reduce((s, c) => s + count(c), 0)
        expect(count(root)).toBe(3)
        expect(cladogramTreeToNewick(root)).toBe("(A,B)")
    })

    it("preserves terminal input order among siblings", () => {
        const terminals = [
            { label: "Z", nodeUuid: "z" },
            { label: "Y", nodeUuid: "y" },
        ] as const
        const lineages = new Map<string, readonly string[]>([
            ["z", ["z", "r"]],
            ["y", ["y", "r"]],
        ])
        const { root } = buildTreeFromTerminalLineages([...terminals], lineages)
        expect(root.children.map(c => c.label)).toEqual(["Z", "Y"])
    })
})
