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
                "Pick a PhyloPic silhouette for a node. Default: primaryImage when its specificNode matches, else filter_clade page 0 index 0 (includes subtaxa). To explore alternates, call find_images with the same filter_clade and license filters, then pick_image with clade_index/clade_page or image_uuid. Overrides skip the default policy. Returns null when none match. Do not retry a narrower subtaxon when null. License filters match find_images.",
            inputSchema: {
                node_uuid: uuidSchema.optional(),
                label: z
                    .string()
                    .min(1)
                    .optional()
                    .describe(
                        "Resolve a PhyloPic node from a name (exact title match preferred), then pick an image. Pass node_uuid when search must be precise.",
                    ),
                image_uuid: uuidSchema
                    .optional()
                    .describe("Use this image UUID (must pass license filters). Skips default pick."),
                clade_index: z
                    .number()
                    .int()
                    .min(0)
                    .optional()
                    .describe("0-based index on filter_clade list (use find_images to preview). With clade_page."),
                clade_page: z
                    .number()
                    .int()
                    .min(0)
                    .optional()
                    .describe("0-based page for clade_index (default 0). Same as find_images page."),
                filter_license_by: licenseFilterSchema,
                filter_license_nc: licenseFilterSchema,
                filter_license_sa: licenseFilterSchema,
            },
            annotations: READ_ONLY,
        },
        async ({
            node_uuid,
            label,
            image_uuid,
            clade_index,
            clade_page,
            filter_license_by,
            filter_license_nc,
            filter_license_sa,
        }) => {
            try {
                if (!node_uuid && !label) {
                    return toolFromError(new Error("Provide node_uuid or label."))
                }
                const options = {
                    ...(filter_license_by === undefined ? {} : { filter_license_by }),
                    ...(filter_license_nc === undefined ? {} : { filter_license_nc }),
                    ...(filter_license_sa === undefined ? {} : { filter_license_sa }),
                    ...(image_uuid === undefined ? {} : { image_uuid }),
                    ...(clade_index === undefined ? {} : { clade_index }),
                    ...(clade_page === undefined ? {} : { clade_page }),
                }
                let nodeUuid = node_uuid
                const warnings: string[] = []
                if (!nodeUuid && label) {
                    const resolved = await resolveLabelToNode(client, label)
                    nodeUuid = resolved.nodeUuid
                    warnings.push(...resolved.warnings)
                }
                const result = await pickImage(client, nodeUuid!, options)
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
