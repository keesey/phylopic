import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import {
    buildTreeFromCollectionUuid,
    buildTreeFromPermalink,
} from "../cladogram/buildTreeFromCollection.js"
import {
    buildTreeFromPhyloPicLabel,
    buildTreeFromPhyloPicNodeUuid,
} from "../cladogram/buildTreeFromPhyloPicSubtree.js"
import { buildTreeFromTerminalLabels } from "../cladogram/buildTreeFromTerminals.js"
import { parseNewickToTree } from "../cladogram/parseNewick.js"
import { pickImage } from "../cladogram/pickImage.js"
import { resolveMrcaFromDescendants } from "../cladogram/resolveMrcaFromDescendants.js"
import { resolveLabelViaDescendantPhylogeny } from "../cladogram/resolveLabelViaDescendantPhylogeny.js"
import { resolveLabelToNode } from "../cladogram/resolveLabelToNode.js"
import { toolFromError, toolSuccess } from "./toolResult.js"

const READ_ONLY = { readOnlyHint: true } as const

const uuidSchema = z.string().uuid()
const licenseFilterSchema = z.enum(["true", "false"]).optional()

export const registerCladogramTools = (server: McpServer, client: PhyloPicClient) => {
    // @ts-expect-error TS2589 — Zod tool inputSchema exceeds TypeScript inference depth
    server.registerTool(
        "parse_newick",
        {
            description:
                "Parse a Newick tree string into hierarchical JSON for cladograms. Returns stable node ids and labels (no layout geometry). Unlabeled internal nodes have no label field—illustrate via pick_image with descendant_node_uuids from labeled subclade roots in each child branch.",
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
        "build_tree_from_terminals",
        {
            description:
                "Build a cladogram hierarchy from terminal taxa only. Resolves labels, loads lineages, and returns a concestor-only tree (not every PhyloPic node on the paths): same JSON as parse_newick, a Newick string (parse_newick for the normal pipeline), and nodeUuidByTreeId. Internal nodes are unlabeled concestors; sibling order is by terminal count (smallest first), then alphabetical.",
            inputSchema: {
                labels: z
                    .array(z.string().min(1))
                    .min(1)
                    .max(500)
                    .describe("Terminal taxa only (e.g. humans, rice, seahorses)."),
            },
            annotations: READ_ONLY,
        },
        async ({ labels }) => {
            try {
                const result = await buildTreeFromTerminalLabels(client, labels)
                return toolSuccess(
                    `Built tree from ${result.terminals.length} terminal taxa (${result.tree.tipCount} tips).`,
                    result,
                )
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "build_tree_from_phylopic_subtree",
        {
            description:
                "Build a cladogram from PhyloPic’s parent/child node hierarchy (embed_childNodes), not a concestor-only tree. Expands from a root node through children, grandchildren, and great-grandchildren by default (max_tip_depth 3). Every node is labeled; nodeUuidByTreeId maps each tree id to the PhyloPic UUID. Use pick_image with image_list ancestral on internal nodes (exclude cladogram parent). Provide root_node_uuid or root_label (not both).",
            inputSchema: {
                root_node_uuid: uuidSchema
                    .optional()
                    .describe("PhyloPic node UUID for the subtree root (e.g. Dinosauria)."),
                root_label: z
                    .string()
                    .min(1)
                    .optional()
                    .describe("Resolve root from a taxon name (exact title match preferred)."),
                max_tip_depth: z
                    .number()
                    .int()
                    .min(0)
                    .max(6)
                    .optional()
                    .describe("Deepest tip depth below root (default 3 = great-grandchildren)."),
            },
            annotations: READ_ONLY,
        },
        async ({ root_node_uuid, root_label, max_tip_depth }) => {
            try {
                if (root_node_uuid && root_label) {
                    return toolFromError(new Error("Provide root_node_uuid or root_label, not both."))
                }
                if (!root_node_uuid && !root_label) {
                    return toolFromError(new Error("Provide root_node_uuid or root_label."))
                }
                const options = max_tip_depth === undefined ? {} : { maxTipDepth: max_tip_depth }
                const result =
                    root_label ?
                        await buildTreeFromPhyloPicLabel(client, root_label, options)
                    :   await buildTreeFromPhyloPicNodeUuid(client, root_node_uuid!, options)
                return toolSuccess(
                    `Built PhyloPic subtree (${result.tree.tipCount} tips, ${Object.keys(result.nodeUuidByTreeId).length} nodes).`,
                    result,
                )
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "build_tree_from_collection",
        {
            description:
                "Build a cladogram hierarchy from a PhyloPic collection or permalink. Uses each collection image’s specific node as a terminal taxon (same concestor-only tree as build_tree_from_terminals). Returns imageUuidByTreeId so tips use the collection silhouettes, not a fresh pick_image default. Provide collection_uuid or permalink_url (not both).",
            inputSchema: {
                collection_uuid: uuidSchema
                    .optional()
                    .describe("Collection UUID from get_collection or create_collection."),
                permalink_url: z
                    .string()
                    .min(1)
                    .optional()
                    .describe("www.phylopic.org/permalinks/{hash} or 64-char hash."),
            },
            annotations: READ_ONLY,
        },
        async ({ collection_uuid, permalink_url }) => {
            try {
                if (collection_uuid && permalink_url) {
                    return toolFromError(new Error("Provide collection_uuid or permalink_url, not both."))
                }
                if (!collection_uuid && !permalink_url) {
                    return toolFromError(new Error("Provide collection_uuid or permalink_url."))
                }
                const result =
                    permalink_url ?
                        await buildTreeFromPermalink(client, permalink_url)
                    :   await buildTreeFromCollectionUuid(client, collection_uuid!)
                return toolSuccess(
                    `Built tree from collection (${result.terminals.length} terminals, ${result.tree.tipCount} tips).`,
                    result,
                )
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    // @ts-expect-error TS2589 — Zod tool inputSchema exceeds TypeScript inference depth
    server.registerTool(
        "pick_image",
        {
            description:
                "Pick a PhyloPic silhouette for a node. Terminal taxa: primary when node-accurate, else filter_clade page 0 (default). Ancestral/internal: image_list ancestral walks filter_node on this node then ancestors until a hit or exclude_node_uuids (cladogram parent)—stop there with no image, do not search above the parent. Unlabeled Newick: descendant_node_uuids → MRCA with image_list ancestral. Alternates: find_images then clade_index or image_uuid.",
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
                image_list: z
                    .enum(["clade", "node", "ancestral"])
                    .optional()
                    .describe("ancestral for internal nodes; clade for terminals (default); node for exact-node only."),
                exclude_node_uuids: z
                    .array(uuidSchema)
                    .optional()
                    .describe(
                        "Cladogram parent PhyloPic UUID: ancestral walk stops here (no image from this node or any ancestor above).",
                    ),
                descendant_node_uuids: z
                    .array(uuidSchema)
                    .min(1)
                    .optional()
                    .describe(
                        "Without label: unlabeled clade—MRCA of these UUIDs, then pick. With label: disambiguate homonyms—MRCA of children, walk lineage for most leafward node whose title matches label, then pick. Do not combine with node_uuid.",
                    ),
                context_labels: z
                    .array(z.string().min(1))
                    .optional()
                    .describe(
                        "Other labels from the same tree. With an abbreviated label such as P. paniscus, genera from these labels (e.g. Pan troglodytes) are tried before GBIF.",
                    ),
                filter_license_by: licenseFilterSchema,
                filter_license_nc: licenseFilterSchema,
                filter_license_sa: licenseFilterSchema,
            },
            annotations: READ_ONLY,
        },
        async ({
            node_uuid,
            label,
            context_labels,
            image_uuid,
            clade_index,
            clade_page,
            image_list,
            exclude_node_uuids,
            descendant_node_uuids,
            filter_license_by,
            filter_license_nc,
            filter_license_sa,
        }) => {
            try {
                const hasDescendants = Boolean(descendant_node_uuids?.length)
                if (!node_uuid && !label && !hasDescendants) {
                    return toolFromError(new Error("Provide node_uuid, label, or descendant_node_uuids."))
                }
                if (hasDescendants && node_uuid) {
                    return toolFromError(new Error("Do not combine descendant_node_uuids with node_uuid."))
                }
                if (label && node_uuid) {
                    return toolFromError(new Error("Provide label or node_uuid, not both."))
                }
                const options = {
                    ...(filter_license_by === undefined ? {} : { filter_license_by }),
                    ...(filter_license_nc === undefined ? {} : { filter_license_nc }),
                    ...(filter_license_sa === undefined ? {} : { filter_license_sa }),
                    ...(image_uuid === undefined ? {} : { image_uuid }),
                    ...(clade_index === undefined ? {} : { clade_index }),
                    ...(clade_page === undefined ? {} : { clade_page }),
                    ...(image_list === undefined ?
                        hasDescendants && !label ?
                            { image_list: "ancestral" as const }
                        :   {}
                    :   { image_list }),
                    ...(exclude_node_uuids === undefined ? {} : { exclude_node_uuids }),
                }
                let nodeUuid = node_uuid
                const warnings: string[] = []
                const resolveOptions = context_labels ? { contextLabels: context_labels } : {}
                if (hasDescendants && label) {
                    const resolved = await resolveLabelViaDescendantPhylogeny(
                        client,
                        label,
                        descendant_node_uuids!,
                        resolveOptions,
                    )
                    nodeUuid = resolved.nodeUuid
                    warnings.push(...resolved.warnings)
                } else if (hasDescendants) {
                    const mrca = await resolveMrcaFromDescendants(client, descendant_node_uuids!)
                    warnings.push(...mrca.warnings)
                    if (!mrca.mrcaUuid) {
                        return toolSuccess("No common ancestor resolved from descendant lineages.", {
                            nodeUuid: null,
                            image: null,
                            warnings,
                        })
                    }
                    nodeUuid = mrca.mrcaUuid
                } else if (!nodeUuid && label) {
                    const resolved = await resolveLabelToNode(client, label, resolveOptions)
                    nodeUuid = resolved.nodeUuid
                    warnings.push(...resolved.warnings)
                }
                const result = await pickImage(client, nodeUuid!, options)
                return toolSuccess(result.image ? `Image ${result.image.uuid} for node ${result.nodeUuid}.` : `No image for node ${result.nodeUuid}.`, {
                    ...result,
                    ...(hasDescendants && !label ? { resolvedFromDescendants: true } : {}),
                    ...(hasDescendants && label ? { disambiguatedViaDescendants: true } : {}),
                    warnings: [...warnings, ...(result.warnings ?? [])],
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )
}
