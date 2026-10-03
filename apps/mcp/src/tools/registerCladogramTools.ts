import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { parseNewickToTree } from "../cladogram/parseNewick.js"
import { pickImage } from "../cladogram/pickImage.js"
import { resolveLabelToNode } from "../cladogram/resolveLabelToNode.js"
import { toolFromError, toolSuccess } from "./toolResult.js"

const READ_ONLY = { readOnlyHint: true } as const

const uuidSchema = z.string().uuid()
const licenseFilterSchema = z.enum(["true", "false"]).optional()

export const registerCladogramTools = (server: McpServer, client: PhyloPicClient) => {
    server.registerTool(
        "parse_newick",
        {
            description:
                "Parse a Newick tree string into hierarchical JSON for cladograms. Returns stable node ids and labels (no layout geometry). Use pick_image per node, then build SVG in the client.",
            inputSchema: {
                newick: z.string().min(1).describe("Newick tree string, with or without trailing semicolon."),
            },
            annotations: READ_ONLY,
        },
        async ({ newick }) => {
            try {
                const tree = parseNewickToTree(newick)
                return toolSuccess(`Parsed Newick tree with ${tree.tipCount} tip(s).`, { tree })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "pick_image",
        {
            description:
                "Pick the PhyloPic image for a node UUID: use primaryImage when its specificNode matches, else the first image on filter_clade page 0 (PhyloPic clade order; filter_clade already includes images on subtaxa). Returns null when no suitable image (e.g. none in clade under license filters, or placeholder primary only). Do not retry with a narrower subtaxon when null—that does not expand the clade search. For user-requested typical/iconic art, resolve the preferred subtaxon via search_nodes first, then call pick_image on that UUID. License filters match find_images.",
            inputSchema: {
                node_uuid: uuidSchema.optional(),
                label: z
                    .string()
                    .min(1)
                    .optional()
                    .describe(
                        "Resolve a PhyloPic node from a name (exact title match preferred), then pick an image. Pass node_uuid when search must be precise.",
                    ),
                filter_license_by: licenseFilterSchema,
                filter_license_nc: licenseFilterSchema,
                filter_license_sa: licenseFilterSchema,
            },
            annotations: READ_ONLY,
        },
        async ({ node_uuid, label, filter_license_by, filter_license_nc, filter_license_sa }) => {
            try {
                if (!node_uuid && !label) {
                    return toolFromError(new Error("Provide node_uuid or label."))
                }
                const filters = {
                    ...(filter_license_by === undefined ? {} : { filter_license_by }),
                    ...(filter_license_nc === undefined ? {} : { filter_license_nc }),
                    ...(filter_license_sa === undefined ? {} : { filter_license_sa }),
                }
                let nodeUuid = node_uuid
                const warnings: string[] = []
                if (!nodeUuid && label) {
                    const resolved = await resolveLabelToNode(client, label)
                    nodeUuid = resolved.nodeUuid
                    warnings.push(...resolved.warnings)
                }
                const result = await pickImage(client, nodeUuid!, filters)
                return toolSuccess(result.image ? `Image ${result.image.uuid} for node ${result.nodeUuid}.` : `No image for node ${result.nodeUuid}.`, {
                    ...result,
                    warnings: [...warnings, ...(result.warnings ?? [])],
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )
}
