import { describe, expect, it } from "vitest"
import { chooseFinestPhylopicClade } from "./chooseFinestPhylopicClade.js"

describe("chooseFinestPhylopicClade", () => {
    it("prefers the finer rank when lineage is not nested", async () => {
        const client = {} as Parameters<typeof chooseFinestPhylopicClade>[0]
        const finest = await chooseFinestPhylopicClade(client, [
            { phylopicUuid: "a", rank: "order" },
            { phylopicUuid: "b", rank: "genus" },
        ])
        expect(finest?.phylopicUuid).toBe("b")
    })
})
