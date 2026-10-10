import { describe, expect, it } from "vitest"
import { findExactPhylopicNodeMatch, pickNodeFromNameSearch, sortNodesByTitleMatch } from "./phylopicNameMatch.js"

describe("phylopicNameMatch", () => {
    it("prefers exact title over API sort order (Homo sapiens vs Homo (sapiens))", () => {
        const items = [
            { uuid: "group", title: "Homo (sapiens)" },
            { uuid: "species", title: "Homo sapiens" },
        ]
        const picked = pickNodeFromNameSearch(items, "Homo sapiens")
        expect(picked?.match).toBe("exact")
        expect(picked?.item.uuid).toBe("species")
    })

    it("sorts exact matches first", () => {
        const sorted = sortNodesByTitleMatch(
            [
                { uuid: "a", title: "Homo (sapiens)" },
                { uuid: "b", title: "Homo sapiens" },
            ],
            "Homo sapiens",
        )
        expect(sorted[0]?.uuid).toBe("b")
    })

    it("findExactPhylopicNodeMatch scans all autocomplete groups", () => {
        const hit = findExactPhylopicNodeMatch(
            [
                { name: "homo", items: [{ uuid: "x", title: "Homo" }] },
                {
                    name: "homo sapiens",
                    items: [
                        { uuid: "group", title: "Homo (sapiens)" },
                        { uuid: "species", title: "Homo sapiens" },
                    ],
                },
            ],
            "Homo sapiens",
        )
        expect(hit?.uuid).toBe("species")
    })
})
