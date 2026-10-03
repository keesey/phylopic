import { describe, expect, it, vi } from "vitest"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { resolveLabelToNode } from "./resolveLabelToNode.js"

const mockClient = (handlers: Record<string, unknown>): PhyloPicClient =>
    ({
        getJson: vi.fn(async (path: string, query?: Record<string, string>) => {
            const key = query?.filter_name ? `${path}?${query.filter_name}` : path
            if (handlers[key] !== undefined) {
                return handlers[key]
            }
            if (path === "/autocomplete") {
                return handlers["/autocomplete"] ?? { matches: [] }
            }
            throw new Error(`unexpected ${key}`)
        }),
    }) as PhyloPicClient

describe("resolveLabelToNode", () => {
    it("picks exact title Homo sapiens over Homo (sapiens) for mixed-case label", async () => {
        const client = mockClient({
            "/autocomplete": { matches: ["homo sapiens"] },
            "/nodes?Homo sapiens": { _embedded: { items: [] } },
            "/nodes?homo sapiens": {
                _embedded: {
                    items: [
                        {
                            uuid: "group-uuid",
                            _links: { self: { title: "Homo (sapiens)" } },
                        },
                        {
                            uuid: "species-uuid",
                            _links: { self: { title: "Homo sapiens" } },
                        },
                    ],
                },
            },
        })

        const result = await resolveLabelToNode(client, "Homo sapiens")
        expect(result.nodeUuid).toBe("species-uuid")
        expect(result.title).toBe("Homo sapiens")
        expect(result.warnings).toEqual([])
    })
})
