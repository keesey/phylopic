import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
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

export const registerTools = (server: McpServer, client: PhyloPicClient) => {
    server.registerTool(
        "search_nodes",
        {
            description:
                "Search PhyloPic phylogenetic nodes by name (autocomplete, then node lookup). Returns node UUIDs; use get_node for cladeImages / images links, then find_images with filter_clade for silhouettes under that taxon. Prefer the broadest matching node for informal groups (e.g. Apiformes for bees, not only Apidae).",
            inputSchema: {
                query: z.string().min(2).describe("Taxonomic name fragment to search for."),
            },
            annotations: READ_ONLY,
        },
        async ({ query }) => {
            try {
                const autocomplete = await client.getJson<{ matches: readonly string[] }>("/autocomplete", { query })
                const matches = autocomplete.matches
                const results = await Promise.all(
                    matches.slice(0, 10).map(async name => {
                        const list = await client.getJson<{
                            _embedded?: { items?: readonly { uuid?: string; _links?: { self?: { title?: string; href?: string } } }[] }
                        }>("/nodes", {
                            filter_name: name,
                            embed_items: "true",
                            page: 0,
                        })
                        const items = (list._embedded?.items ?? []).map(item => ({
                            title: item._links?.self?.title,
                            uuid: item.uuid,
                            href: item._links?.self?.href,
                        }))
                        return { name, items }
                    }),
                )
                return toolSuccess(`Found ${matches.length} name match(es) for "${query}".`, {
                    query,
                    matches,
                    results,
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
                "List silhouette images. Use filter_clade with a node UUID from search_nodes/get_node (_links.cladeImages) to include all silhouettes under that taxon; filter_node is narrower (images for that node only). filter_name uses exact normalized names from autocomplete. License filters: filter_license_nc=false excludes NonCommercial-licensed images. Pages are 0-based (page=0 is the first page). Workflow: search_nodes → get_node if needed → find_images with filter_clade.",
            inputSchema: {
                filter_name: z.string().optional(),
                filter_node: uuidSchema.optional(),
                filter_clade: uuidSchema.optional(),
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
            description: "Get an entity collection by UUID.",
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
}
