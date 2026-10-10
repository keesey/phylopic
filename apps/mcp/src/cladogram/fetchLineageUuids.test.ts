import { describe, expect, it, vi } from "vitest"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"

const page = (start: number, hasNext: boolean) => ({
    _embedded: { items: Array.from({ length: 48 }, (_, i) => ({ uuid: `n${start + i}` })) },
    _links: { next: hasNext ? { href: "/next" } : null },
})

describe("fetchLineageUuids", () => {
    it("stops after the last full page instead of requesting one past the end", async () => {
        const getJson = vi.fn(async (_path: string, query?: Record<string, unknown>) => {
            if (query?.page === 0) return page(0, true)
            if (query?.page === 1) return page(48, false)
            throw new Error("The requested page is out of bounds.")
        })
        const uuids = await fetchLineageUuids({ getJson } as unknown as PhyloPicClient, "rodentia")
        expect(uuids).toHaveLength(96)
        expect(getJson).toHaveBeenCalledTimes(2)
    })
})
