import { describe, expect, it } from "vitest"
import { fetchLineageEntries, type LineageFetcher } from "./fetchLineageUuids.js"

describe("fetchLineageEntries", () => {
    it("uses list item link titles when embedded nodes omit self titles", async () => {
        const fetchPage: LineageFetcher = async () => ({
            _embedded: {
                items: [{ uuid: "child-uuid" }, { uuid: "parent-uuid", names: [[{ class: "scientific", text: "Parentidae" }]] }],
            },
            _links: {
                items: [
                    { href: "/nodes/child-uuid?build=1", title: "Child genus" },
                    { href: "/nodes/parent-uuid?build=1", title: "Parentidae" },
                ],
                next: null,
            },
        })
        const entries = await fetchLineageEntries(fetchPage, "child-uuid")
        expect(entries[0]).toEqual({ uuid: "child-uuid", title: "Child genus" })
        expect(entries[1]?.title).toBe("Parentidae")
    })
})
