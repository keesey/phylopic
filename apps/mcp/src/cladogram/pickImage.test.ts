import { describe, expect, it, vi } from "vitest"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { pickImage } from "./pickImage.js"

const NODE = "67382596-44bb-4e5d-b070-1c0788b622cf"
const OTHER = "d67d3bf6-3509-4ab6-819a-cd409985347e"

const mockClient = (overrides: Partial<PhyloPicClient>): PhyloPicClient => overrides as PhyloPicClient

describe("pickImage", () => {
    it("returns null when primary specificNode mismatches and clade list is empty", async () => {
        const client = mockClient({
            getJson: vi.fn(async (path: string) => {
                if (path === `/nodes/${NODE}`) {
                    return { _embedded: { primaryImage: { uuid: OTHER } } }
                }
                if (path === `/images/${OTHER}`) {
                    return {
                        uuid: OTHER,
                        _links: {
                            license: { href: "https://creativecommons.org/publicdomain/zero/1.0/" },
                            specificNode: { href: `/nodes/${OTHER}` },
                        },
                        _embedded: { specificNode: { uuid: OTHER } },
                    }
                }
                throw new Error(`unexpected getJson ${path}`)
            }),
            listImages: vi.fn(async () => ({ _embedded: { items: [] } })),
        })

        const result = await pickImage(client, NODE)
        expect(result.image).toBeNull()
        expect(result.warnings?.some(w => w.includes("Skipped primaryImage"))).toBe(true)
    })

    it("returns primary when specificNode matches", async () => {
        const client = mockClient({
            getJson: vi.fn(async (path: string) => {
                if (path === `/nodes/${NODE}`) {
                    return { _embedded: { primaryImage: { uuid: "img-1" } } }
                }
                if (path === "/images/img-1") {
                    return {
                        uuid: "img-1",
                        _links: {
                            license: { href: "https://creativecommons.org/publicdomain/zero/1.0/" },
                            vectorFile: { href: "https://images.phylopic.org/images/img-1/vector.svg" },
                            specificNode: { href: `/nodes/${NODE}` },
                        },
                        _embedded: { specificNode: { uuid: NODE } },
                    }
                }
                throw new Error(`unexpected getJson ${path}`)
            }),
            listImages: vi.fn(async () => ({ _embedded: { items: [] } })),
        })

        const result = await pickImage(client, NODE)
        expect(result.image?.uuid).toBe("img-1")
    })

    it("walks lineage for ancestral pick and skips excluded cladogram parent", async () => {
        const PARENT = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        const CHILD = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        const GRAND = "cccccccc-cccc-cccc-cccc-cccccccccccc"
        const listImages = vi.fn(async (query: Record<string, unknown>) => {
            const node = query.filter_node as string
            if (node === CHILD) {
                return { _embedded: { items: [] } }
            }
            if (node === PARENT) {
                return { _embedded: { items: [] } }
            }
            if (node === GRAND) {
                return {
                    _embedded: {
                        items: [
                            {
                                uuid: "from-grandparent",
                                _links: {
                                    license: { href: "https://creativecommons.org/publicdomain/zero/1.0/" },
                                    specificNode: { href: `/nodes/${GRAND}` },
                                },
                                _embedded: { specificNode: { uuid: GRAND } },
                            },
                        ],
                    },
                }
            }
            return { _embedded: { items: [] } }
        })
        const client = mockClient({
            getJson: vi.fn(async (path: string) => {
                if (path === `/nodes/${CHILD}`) {
                    return { _embedded: { primaryImage: null } }
                }
                if (path === `/nodes/${PARENT}`) {
                    return { _embedded: { primaryImage: null } }
                }
                if (path === `/nodes/${GRAND}`) {
                    return { _embedded: { primaryImage: null } }
                }
                if (path === `/nodes/${CHILD}/lineage`) {
                    return {
                        _embedded: { items: [{ uuid: CHILD }, { uuid: PARENT }, { uuid: GRAND }] },
                        _links: {},
                    }
                }
                throw new Error(`unexpected getJson ${path}`)
            }),
            listImages,
        })

        const result = await pickImage(client, CHILD, {
            image_list: "ancestral",
            exclude_node_uuids: [PARENT],
        })
        expect(result.image?.uuid).toBe("from-grandparent")
        expect(result.warnings?.some(w => w.includes("ancestor"))).toBe(true)
    })

    it("uses filter_node when image_list is node", async () => {
        const listImages = vi.fn(async (query: Record<string, unknown>) => {
            expect(query.filter_node).toBe(NODE)
            expect(query.filter_clade).toBeUndefined()
            return {
                _embedded: {
                    items: [
                        {
                            uuid: "node-only",
                            _links: {
                                license: { href: "https://creativecommons.org/publicdomain/zero/1.0/" },
                                vectorFile: { href: "https://example/node-only.svg" },
                                specificNode: { href: `/nodes/${NODE}` },
                            },
                            _embedded: { specificNode: { uuid: NODE } },
                        },
                    ],
                },
            }
        })
        const client = mockClient({
            getJson: vi.fn(async (path: string) => {
                if (path === `/nodes/${NODE}`) {
                    return { _embedded: { primaryImage: null } }
                }
                throw new Error(`unexpected getJson ${path}`)
            }),
            listImages,
        })

        const result = await pickImage(client, NODE, { image_list: "node" })
        expect(result.image?.uuid).toBe("node-only")
    })

    it("uses clade_index override instead of primary", async () => {
        const client = mockClient({
            getJson: vi.fn(async () => {
                throw new Error("getJson should not run for clade_index override")
            }),
            listImages: vi.fn(async () => ({
                _embedded: {
                    items: [
                        { uuid: "first", _links: { license: { href: "https://creativecommons.org/publicdomain/zero/1.0/" } } },
                        {
                            uuid: "second",
                            _links: {
                                license: { href: "https://creativecommons.org/publicdomain/zero/1.0/" },
                                vectorFile: { href: "https://example/second.svg" },
                            },
                        },
                    ],
                },
            })),
        })

        const result = await pickImage(client, NODE, { clade_index: 1 })
        expect(result.image?.uuid).toBe("second")
        expect(result.warnings?.some(w => w.includes("clade list"))).toBe(true)
    })
})
