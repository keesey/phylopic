import { describe, expect, it, vi } from "vitest"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { isTargetOnImageTaggedLineage } from "./imageTaggedLineage.js"

const mockClient = (overrides: Record<string, unknown>): PhyloPicClient => overrides as unknown as PhyloPicClient

describe("isTargetOnImageTaggedLineage", () => {
    it("accepts the specific taxon when general is unset", async () => {
        const NODE = "11111111-1111-1111-1111-111111111111"
        const image = {
            _embedded: { specificNode: { uuid: NODE }, generalNode: null },
        }
        expect(await isTargetOnImageTaggedLineage(mockClient({}), NODE, image)).toBe(true)
        expect(await isTargetOnImageTaggedLineage(mockClient({}), "22222222-2222-2222-2222-222222222222", image)).toBe(
            false,
        )
    })

    it("accepts ancestors between specific and general on the lineage", async () => {
        const SPECIFIC = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        const CLADE = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        const GENERAL = "cccccccc-cccc-cccc-cccc-cccccccccccc"
        const client = mockClient({
            getJson: vi.fn(async (path: string) => {
                if (path === `/nodes/${SPECIFIC}/lineage`) {
                    return {
                        _embedded: {
                            items: [{ uuid: SPECIFIC }, { uuid: CLADE }, { uuid: GENERAL }],
                        },
                        _links: {},
                    }
                }
                throw new Error(path)
            }),
        })
        const image = {
            _embedded: {
                specificNode: { uuid: SPECIFIC },
                generalNode: { uuid: GENERAL },
            },
        }
        expect(await isTargetOnImageTaggedLineage(client, CLADE, image)).toBe(true)
        expect(await isTargetOnImageTaggedLineage(client, GENERAL, image)).toBe(true)
        expect(await isTargetOnImageTaggedLineage(client, SPECIFIC, image)).toBe(true)
    })
})
