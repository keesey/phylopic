import { describe, expect, it } from "vitest"
import { parseNewickToTree } from "./parseNewick.js"

const HOMINIDAE =
    "((Pongo abelii,Pongo tapanuliensis,Pongo pygmaeus)Pongo,((Gorilla gorilla,Gorilla beringei)Gorilla,(Homo sapiens,(Pan troglodytes,Pan paniscus)Pan))Homininae)Hominidae;"

describe("parseNewickToTree", () => {
    it("parses labeled internal nodes and tips", () => {
        const { root, tipCount } = parseNewickToTree(HOMINIDAE)
        expect(tipCount).toBe(8)
        expect(root.label).toBe("Hominidae")
        expect(root.children).toHaveLength(2)
        const homininae = root.children.find(node => node.label === "Homininae")
        expect(homininae).toBeDefined()
    })

    it("assigns stable ids across parses", () => {
        const a = parseNewickToTree("(A,B)Root")
        const b = parseNewickToTree("(A,B)Root")
        expect(a.root.id).toBe(b.root.id)
        expect(a.root.children[0]?.id).toBe(b.root.children[0]?.id)
    })

    it("reads underscores in unquoted labels as spaces", () => {
        const { root } = parseNewickToTree("(G._Gorilla:0.17,'Homo_sapiens',(P._paniscus,H._sapiens):0.08);")
        expect(root.children.map(c => c.label)).toEqual(["G. Gorilla", "Homo_sapiens", undefined])
        expect(root.children[2]!.children.map(c => c.label)).toEqual(["P. paniscus", "H. sapiens"])
    })

    it("preserves Newick left-to-right sibling order", () => {
        const { root } = parseNewickToTree("(A,B)Root")
        expect(root.children.map(c => c.label)).toEqual(["A", "B"])
        const hominidae = parseNewickToTree(HOMINIDAE).root
        expect(hominidae.children.map(c => c.label)).toEqual(["Pongo", "Homininae"])
        const homininae = hominidae.children.find(c => c.label === "Homininae")!
        expect(homininae.children.map(c => c.label)).toEqual(["Gorilla", undefined])
        const homoPan = homininae.children.find(c => !c.label)!
        expect(homoPan.children.map(c => c.label)).toEqual(["Homo sapiens", "Pan"])
    })
})
