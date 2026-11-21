import { describe, expect, it } from "vitest"
import { gbifObjectIDsFromNameUsage } from "./gbif.js"

describe("gbifObjectIDsFromNameUsage", () => {
    it("collects rank keys from least to most inclusive without duplicates", () => {
        const ids = gbifObjectIDsFromNameUsage(
            {
                key: 5421410,
                speciesKey: 5421410,
                genusKey: 3191248,
                familyKey: 5399,
                orderKey: 422,
                classKey: 220,
                phylumKey: 7707728,
                kingdomKey: 6,
            },
            5421410,
        )
        expect(ids).toEqual(["5421410", "3191248", "5399", "422", "220", "7707728", "6"])
    })
})
