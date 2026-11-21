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
    }) as unknown as PhyloPicClient

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

    describe("abbreviated genus", () => {
        const node = (uuid: string, title: string) => ({
            _embedded: { items: [{ uuid, _links: { self: { title } } }] },
        })
        const gbif = (...canonicalNames: string[]) =>
            vi.fn(async () => Response.json({ results: canonicalNames.map(canonicalName => ({ canonicalName })) }))
        const client = mockClient({
            "/nodes?homo sapiens": node("homo-sapiens", "Homo sapiens"),
            "/nodes?pan paniscus": node("pan-paniscus", "Pan paniscus"),
            "/nodes?gorilla gorilla": node("gorilla-gorilla", "Gorilla gorilla"),
            "/nodes?tetragonula sapiens": node("bee", "Tetragonula sapiens"),
        })

        it("resolves H. sapiens to Homo sapiens via GBIF, skipping names PhyloPic lacks", async () => {
            const fetch = gbif("Pocockia sapiens", "Homo sapiens", "Habrocestum sapiens", "Tetragonula sapiens")
            const result = await resolveLabelToNode(client, "H. sapiens", { fetch })
            expect(result.nodeUuid).toBe("homo-sapiens")
            expect(result.warnings).toEqual(['Expanded "H. sapiens" to "Homo sapiens" via GBIF.'])
        })

        it("matches a capitalized epithet", async () => {
            const result = await resolveLabelToNode(client, "G. Gorilla", {
                fetch: gbif("Gorilla gorilla", "Ghanister gorilla"),
            })
            expect(result.nodeUuid).toBe("gorilla-gorilla")
        })

        it("prefers genera from other labels in the tree", async () => {
            const fetch = gbif()
            const result = await resolveLabelToNode(client, "P. paniscus", {
                contextLabels: ["Pongo", "Pan troglodytes", "P. paniscus"],
                fetch,
            })
            expect(result.nodeUuid).toBe("pan-paniscus")
            expect(result.warnings).toEqual(['Expanded "P. paniscus" to "Pan paniscus" from other labels in the tree.'])
            expect(fetch).not.toHaveBeenCalled()
        })

        it("refuses to guess when several expansions exist in PhyloPic", async () => {
            const ambiguous = mockClient({
                "/nodes?homo sapiens": node("homo-sapiens", "Homo sapiens"),
                "/nodes?habrocestum sapiens": node("spider", "Habrocestum sapiens"),
            })
            await expect(
                resolveLabelToNode(ambiguous, "H. sapiens", { fetch: gbif("Homo sapiens", "Habrocestum sapiens") }),
            ).rejects.toThrow("ambiguous")
        })

        it("accepts a candidate that PhyloPic lists under another title", async () => {
            const synonymClient = mockClient({
                "/nodes?homo sapiens": {
                    _embedded: {
                        items: [
                            {
                                uuid: "homo-sapiens",
                                names: [[{ class: "scientific", text: "Homo sapiens" }]],
                                _links: { self: { title: "Humanity" } },
                            },
                        ],
                    },
                },
            })
            const result = await resolveLabelToNode(synonymClient, "H. sapiens", { fetch: gbif("Homo sapiens") })
            expect(result.nodeUuid).toBe("homo-sapiens")
        })

        it("does not fall back to a fuzzy match", async () => {
            await expect(resolveLabelToNode(client, "X. sapiens", { fetch: gbif() })).rejects.toThrow(
                'No PhyloPic node found for abbreviated label "X. sapiens"',
            )
        })
    })

    describe("common names", () => {
        const scientific = (text: string, citation?: string) => [
            { class: "scientific", text },
            ...(citation ? [{ class: "citation", text: citation }] : []),
        ]
        const nodeWithNames = (uuid: string, title: string, ...names: ReturnType<typeof scientific>[]) => ({
            _embedded: { items: [{ uuid, names, _links: { self: { title } } }] },
        })
        const vernacular = (...results: [string, ...string[]][]) =>
            vi.fn(async () =>
                Response.json({
                    results: results.map(([canonicalName, ...names]) => ({
                        canonicalName,
                        vernacularNames: names.map(vernacularName => ({ vernacularName, language: "eng" })),
                    })),
                }),
            )
        const client = mockClient({
            "/nodes?bovinae": nodeWithNames(
                "bovinae",
                "Boodontia",
                scientific("Boodontia"),
                scientific("Bovinae", "Gray 1821"),
            ),
            "/nodes?bovidae": nodeWithNames("bovidae", "Bovidae", scientific("Bovidae")),
            "/nodes?rodentia": nodeWithNames("rodentia", "Rodentia", scientific("Rodentia")),
            "/nodes?homo": nodeWithNames("homo", "Homo", scientific("Homo")),
            "/nodes?homo sapiens": nodeWithNames("homo-sapiens", "Homo sapiens", scientific("Homo sapiens")),
        })

        it("reads bovine as Bovinae, matching a non-primary name, before asking GBIF", async () => {
            const fetch = vernacular(["Bovidae", "Bovine"])
            const result = await resolveLabelToNode(client, "Bovine", { fetch })
            expect(result.nodeUuid).toBe("bovinae")
            expect(fetch).not.toHaveBeenCalled()
        })

        it("resolves rodent to Rodentia via GBIF common names, ignoring partial matches", async () => {
            const fetch = vernacular(["Hoplopsyllus anomalus", "Rodent Flea"], ["Rodentia", "rodent", "Rodents"])
            const result = await resolveLabelToNode(client, "Rodent", { fetch })
            expect(result.nodeUuid).toBe("rodentia")
            expect(result.warnings).toEqual(['Resolved common name "Rodent" to "Rodentia" via GBIF.'])
        })

        it("prefers a GBIF common name over an old scientific name on another node", async () => {
            const gibbonClient = mockClient({
                "/nodes?gibbon": nodeWithNames(
                    "hylobates-lar",
                    "Hylobates lar",
                    scientific("Hylobates lar"),
                    scientific("Gibbon", "à mains blanches"),
                ),
                "/nodes?hylobatidae": nodeWithNames("hylobatidae", "Hylobatidae", scientific("Hylobatidae")),
            })
            const fetch = vernacular(["Hylobatidae", "gibbon", "gibbons"])
            const result = await resolveLabelToNode(gibbonClient, "gibbon", { fetch })
            expect(result.nodeUuid).toBe("hylobatidae")
        })

        it("prefers the GBIF record that lists the common name most often", async () => {
            const fetch = vernacular(["Homo", "Humans"], ["Homo sapiens", "Human", "human", "Humans"])
            const result = await resolveLabelToNode(client, "human", { fetch })
            expect(result.nodeUuid).toBe("homo-sapiens")
        })
    })
})
