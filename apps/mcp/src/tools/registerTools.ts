import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { searchExternalTaxa, type ExternalAuthority } from "@phylopic/search"
import { z } from "zod"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { SEARCH_NODES_QUERY_HINT } from "../agentInstructions.js"
import { findExactPhylopicNodeMatch, nodeTitle, sortNodesByTitleMatch } from "../search/phylopicNameMatch.js"
import { createResolveToPhylopic } from "../search/resolveExternalToPhylopic.js"
import { registerCladogramTools } from "./registerCladogramTools.js"
import { registerCollectionTools } from "./registerCollectionTools.js"
import { toolFromError, toolSuccess } from "./toolResult.js"

const READ_ONLY = { readOnlyHint: true } as const

const uuidSchema = z.string().uuid()

const licenseFilterSchema = z.enum(["true", "false"]).optional()

const pageSchema = z
    .number()
    .int()
    .min(0)
    .optional()
    .describe("0-based page index (first page is 0). Required by the API when using embed_items on lists.")

const externalAuthoritySchema = z.enum(["gbif.org", "opentreeoflife.org", "paleobiodb.org"])

export const registerTools = (server: McpServer, client: PhyloPicClient) => {
    server.registerTool(
        "search_nodes",
        {
            description:
                "Required first step to map a taxon to a PhyloPic node UUID. Searches PhyloPic (autocomplete + nodes) and, by default, GBIF, Open Tree of Life, and PBDB with resolve to PhyloPic (see https://www.phylopic.org/articles/api-recipes ). Prefer phylopic.exactMatch or a node whose title exactly matches query (case-insensitive)—e.g. Homo sapiens not Homo (sapiens). Use external[].phylopic only when PhyloPic name search has no exact title match. Do not guess UUIDs from general knowledge. Then find_images with filter_clade. Prefer the broadest exact match when the user asked for a group.",
            inputSchema: {
                query: z.string().min(2).describe(SEARCH_NODES_QUERY_HINT),
                include_external: z
                    .boolean()
                    .optional()
                    .describe("When true (default), also search GBIF, Open Tree of Life, and PBDB and resolve to PhyloPic nodes."),
                external_sources: z
                    .array(externalAuthoritySchema)
                    .optional()
                    .describe("Subset of external authorities to query. Defaults to all three."),
            },
            annotations: READ_ONLY,
        },
        async ({ query, include_external, external_sources }) => {
            try {
                const autocomplete = await client.getJson<{ matches: readonly string[] }>("/autocomplete", { query })
                const matches = autocomplete.matches
                const nameQueries = [
                    query,
                    ...(query.toLowerCase() !== query ? [query.toLowerCase()] : []),
                    ...matches,
                ].filter((name, index, all) => all.findIndex(n => n.toLowerCase() === name.toLowerCase()) === index)

                const results = await Promise.all(
                    nameQueries.slice(0, 10).map(async name => {
                        try {
                            const list = await client.getJson<{
                                _embedded?: {
                                    items?: readonly {
                                        uuid?: string
                                        _links?: { self?: { title?: string; href?: string } }
                                    }[]
                                }
                            }>("/nodes", {
                                filter_name: name,
                                embed_items: "true",
                                page: 0,
                            })
                            const items = sortNodesByTitleMatch(
                                (list._embedded?.items ?? []).map(item => ({
                                    title: nodeTitle(item),
                                    uuid: item.uuid,
                                    href: item._links?.self?.href,
                                })),
                                query,
                            )
                            return { name, items }
                        } catch {
                            return { name, items: [] as const }
                        }
                    }),
                )

                const exactMatch = findExactPhylopicNodeMatch(results, query)

                const external =
                    include_external === false
                        ? []
                        : await searchExternalTaxa(query, {
                              limitPerSource: 8,
                              resolve: createResolveToPhylopic(client),
                              sources: external_sources as ExternalAuthority[] | undefined,
                          })

                const externalResolved = external.filter(hit => hit.phylopic?.uuid).length
                const summaryParts = [`${matches.length} PhyloPic name match(es)`]
                if (include_external !== false) {
                    summaryParts.push(
                        `${external.length} external suggestion(s), ${externalResolved} resolved to PhyloPic node(s)`,
                    )
                }

                const summary =
                    exactMatch?.uuid ?
                        `Found ${summaryParts.join("; ")} for "${query}". Exact PhyloPic title match: ${exactMatch.title ?? exactMatch.uuid}.`
                    :   `Found ${summaryParts.join("; ")} for "${query}". No exact PhyloPic title match—use external phylopic only as fallback.`

                return toolSuccess(summary, {
                    query,
                    phylopic: { matches, results, exactMatch },
                    external,
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "get_node",
        {
            description: "Get a phylogenetic node by UUID.",
            inputSchema: { uuid: uuidSchema },
            annotations: READ_ONLY,
        },
        async ({ uuid }) => {
            try {
                const node = await client.getJson(`/nodes/${uuid}`, {})
                return toolSuccess(`Node ${uuid}.`, { node })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "get_root_node",
        {
            description: "Get the PhyloPic root phylogenetic node (via /root).",
            inputSchema: {},
            annotations: READ_ONLY,
        },
        async () => {
            try {
                const node = await client.getJson("/root", {})
                return toolSuccess("Root phylogenetic node.", { node })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "get_lineage",
        {
            description: "Get the lineage of a phylogenetic node.",
            inputSchema: {
                uuid: uuidSchema,
                page: pageSchema,
            },
            annotations: READ_ONLY,
        },
        async ({ uuid, page }) => {
            try {
                const lineage = await client.getJson(`/nodes/${uuid}/lineage`, {
                    page: page ?? 0,
                    embed_items: "true",
                })
                return toolSuccess(`Lineage for node ${uuid}.`, { lineage })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "find_images",
        {
            description:
                'List silhouette images. Use filter_clade with a node UUID from search_nodes/get_node; filter_clade includes images on that taxon and its subtaxa (descendants). Clade lists are sorted by phylogenetic proximity to the node (same order as the silhouettes page on phylopic.org). Default: first item on page 0 when no specific image is requested. Override when the user asks for a typical, iconic, or representative silhouette—then a narrower node UUID is a deliberate choice via search_nodes, not a retry after an empty list (subtaxa were already included). filter_node matches only that node, not descendants. License filters only when the user requires them (e.g. filter_license_nc=false). Pages are 0-based (page=0 first).',
            inputSchema: {
                filter_name: z.string().optional(),
                filter_node: uuidSchema.optional(),
                filter_clade: uuidSchema
                    .optional()
                    .describe("Node UUID: images on this taxon and all subtaxa (descendants)."),
                filter_license_by: licenseFilterSchema.describe(
                    '"true" or "false" — require or exclude attribution (BY) licenses.',
                ),
                filter_license_nc: licenseFilterSchema.describe(
                    '"false" excludes NonCommercial (NC) licenses; use for commercial-friendly results.',
                ),
                filter_license_sa: licenseFilterSchema.describe(
                    '"true" or "false" — require or exclude ShareAlike (SA) licenses.',
                ),
                page: pageSchema,
            },
            annotations: READ_ONLY,
        },
        async ({
            filter_name,
            filter_node,
            filter_clade,
            filter_license_by,
            filter_license_nc,
            filter_license_sa,
            page,
        }) => {
            try {
                if (!filter_name && !filter_node && !filter_clade) {
                    return toolFromError(new Error("Provide filter_name, filter_node, or filter_clade."))
                }
                const images = await client.getJson("/images", {
                    ...(filter_name === undefined ? {} : { filter_name }),
                    ...(filter_node === undefined ? {} : { filter_node }),
                    ...(filter_clade === undefined ? {} : { filter_clade }),
                    ...(filter_license_by === undefined ? {} : { filter_license_by }),
                    ...(filter_license_nc === undefined ? {} : { filter_license_nc }),
                    ...(filter_license_sa === undefined ? {} : { filter_license_sa }),
                    page: page ?? 0,
                    embed_items: "true",
                    embed_contributor: "true",
                    embed_specificNode: "true",
                })
                return toolSuccess("Silhouette image list.", { images })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "get_image",
        {
            description: "Get a silhouette image by UUID, including file links and attribution.",
            inputSchema: { uuid: uuidSchema },
            annotations: READ_ONLY,
        },
        async ({ uuid }) => {
            try {
                const image = await client.getJson(`/images/${uuid}`, {
                    embed_contributor: "true",
                    embed_generalNode: "true",
                    embed_nodes: "true",
                    embed_specificNode: "true",
                })
                return toolSuccess(`Image ${uuid}.`, { image })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "resolve_external_id",
        {
            description: "Resolve a single external taxonomic identifier to a PhyloPic node.",
            inputSchema: {
                authority: z.string().min(1),
                namespace: z.string().min(1),
                objectID: z.string().min(1),
            },
            annotations: READ_ONLY,
        },
        async ({ authority, namespace, objectID }) => {
            try {
                const resolved = await client.resolveExternalSingle(authority, namespace, objectID)
                return toolSuccess(`Resolved ${authority}/${namespace}/${objectID}.`, {
                    matchedObjectID: objectID,
                    ...resolved,
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "resolve_external_ids",
        {
            description:
                "Resolve the first matching PhyloPic node from an ordered list of external IDs (most specific first, then ancestors). Use list_namespaces() for valid authority/namespace pairs. See https://www.phylopic.org/articles/api-recipes .",
            inputSchema: {
                authority: z.string().min(1),
                namespace: z.string().min(1),
                objectIDs: z.array(z.string().min(1)).min(1),
            },
            annotations: READ_ONLY,
        },
        async ({ authority, namespace, objectIDs }) => {
            try {
                const resolved = await client.resolveExternal(authority, namespace, objectIDs)
                return toolSuccess(`Resolved via ${authority}/${namespace}.`, {
                    objectIDs,
                    note: "The API returns the first ID in objectIDs that maps to a PhyloPic node; the matched external ID is not reported separately.",
                    ...resolved,
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "get_contributor",
        {
            description: "Get an image contributor by UUID.",
            inputSchema: { uuid: uuidSchema },
            annotations: READ_ONLY,
        },
        async ({ uuid }) => {
            try {
                const contributor = await client.getJson(`/contributors/${uuid}`, {})
                return toolSuccess(`Contributor ${uuid}.`, { contributor })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "list_contributor_images",
        {
            description: "List silhouette images contributed by a contributor UUID.",
            inputSchema: {
                uuid: uuidSchema,
                page: pageSchema,
            },
            annotations: READ_ONLY,
        },
        async ({ uuid, page }) => {
            try {
                const images = await client.getJson("/images", {
                    filter_contributor: uuid,
                    page: page ?? 0,
                    embed_items: "true",
                    embed_contributor: "true",
                    embed_specificNode: "true",
                })
                return toolSuccess(`Images by contributor ${uuid}.`, { images })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "get_collection",
        {
            description:
                "Get a collection record by UUID (image UUID list). For license/attribution text use describe_image_set_usage; for a www usage page use create_collection.",
            inputSchema: { uuid: uuidSchema },
            annotations: READ_ONLY,
        },
        async ({ uuid }) => {
            try {
                const collection = await client.getJson(`/collections/${uuid}`, {})
                return toolSuccess(`Collection ${uuid}.`, { collection })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "list_licenses",
        {
            description: "List licenses available for PhyloPic silhouettes.",
            inputSchema: {},
            annotations: READ_ONLY,
        },
        async () => {
            try {
                const licenses = await client.getJson("/licenses", {})
                return toolSuccess("PhyloPic licenses.", { licenses })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "list_namespaces",
        {
            description: "List external authorities and namespaces supported for resolve_external_id(s).",
            inputSchema: {},
            annotations: READ_ONLY,
        },
        async () => {
            try {
                const namespaces = await client.getJson("/namespaces", {})
                return toolSuccess("Authorized external namespaces.", { namespaces })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    registerCladogramTools(server, client)
    registerCollectionTools(server, client)
}
