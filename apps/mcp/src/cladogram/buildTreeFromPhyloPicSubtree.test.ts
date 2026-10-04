import { describe, expect, it, vi } from "vitest"
import type { Node } from "@phylopic/api-models"
import {
    buildTreeFromPhyloPicNodeUuid,
    labelFromPhylopicNode,
} from "./buildTreeFromPhyloPicSubtree.js"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"

const node = (uuid: string, label: string, children: Node[] = []): Node =>
    ({
        uuid,
        names: [[{ class: "scientific", text: label }]],
        _links: { childNodes: children.map(c => ({ href: `/nodes/${c.uuid}`, title: labelFromPhylopicNode(c) })) },
        _embedded: { childNodes: children },
    }) as unknown as Node

describe("labelFromPhylopicNode", () => {
    it("shortens scientific nomen", () => {
        expect(
            labelFromPhylopicNode({
                uuid: "a",
                names: [[{ class: "scientific", text: "Tyrannosaurus" }, { class: "author", text: "Osborn 1905" }]],
                _links: { childNodes: [] },
            } as Node),
        ).toBe("Tyrannosaurus")
    })
})

describe("buildTreeFromPhyloPicNodeUuid", () => {
    it("stops at maxTipDepth with PhyloPic child links", async () => {
        const grandA = node("ga", "Grand A")
        const grandB = node("gb", "Grand B")
        const childA = node("ca", "Child A", [grandA, grandB])
        const childB = node("cb", "Child B")
        const root = node("root", "Dinosauria", [childA, childB])

        const getJson = vi.fn(async (path: string) => {
            const uuid = path.split("/").pop()
            if (uuid === "root") return { ...root, _embedded: { childNodes: [childA, childB] } }
            if (uuid === "ca") return { ...childA, _embedded: { childNodes: [grandA, grandB] } }
            if (uuid === "cb") return { ...childB, _embedded: { childNodes: [] } }
            if (uuid === "ga") return { ...grandA, _embedded: { childNodes: [] } }
            if (uuid === "gb") return { ...grandB, _embedded: { childNodes: [] } }
            throw new Error(`unexpected ${path}`)
        })

        const result = await buildTreeFromPhyloPicNodeUuid({ getJson } as unknown as PhyloPicClient, "root", {
            maxTipDepth: 2,
        })

        expect(result.tree.tipCount).toBe(3)
        expect(result.terminals.map(t => t.label).sort()).toEqual(["Child B", "Grand A", "Grand B"])
        expect(result.newick).toContain("Dinosauria")
        expect(result.nodeUuidByTreeId.n0).toBe("root")
    })
})
