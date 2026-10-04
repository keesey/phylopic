import { describe, expect, it } from "vitest"
import { ancestralPickOptions, cladogramParentPhyloUuid } from "./ancestralPickOptions.js"

describe("cladogramParentPhyloUuid", () => {
    it("returns parent tree id phylo uuid when present", () => {
        expect(
            cladogramParentPhyloUuid({ parent: { id: "p1" } }, { p1: "uuid-parent", c1: "uuid-child" }),
        ).toBe("uuid-parent")
    })
})

describe("ancestralPickOptions", () => {
    it("sets image_list ancestral and excludes cladogram parent", () => {
        const opts = ancestralPickOptions(
            { filter_license_nc: "false" },
            { parent: { id: "p1" } },
            { p1: "uuid-parent" },
        )
        expect(opts.image_list).toBe("ancestral")
        expect(opts.exclude_node_uuids).toEqual(["uuid-parent"])
    })
})
