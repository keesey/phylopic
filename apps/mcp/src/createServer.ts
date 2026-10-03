import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { MCP_AGENT_INSTRUCTIONS } from "./agentInstructions.js"
import { PhyloPicClient, type PhyloPicClientOptions } from "./client/PhyloPicClient.js"
import { registerResources } from "./resources/registerResources.js"
import { registerTools } from "./tools/registerTools.js"

export const createMcpServer = (clientOptions?: PhyloPicClientOptions) => {
    const client = new PhyloPicClient(clientOptions)
    const server = new McpServer(
        {
            name: "phylopic",
            version: "0.1.0",
        },
        {
            capabilities: {},
            instructions: MCP_AGENT_INSTRUCTIONS,
        },
    )

    registerTools(server, client)
    registerResources(server, client)

    server.registerPrompt(
        "illustrate_taxon",
        {
            description:
                "Workflow for finding a PhyloPic silhouette for a taxon, respecting license requirements and attribution.",
            argsSchema: {
                taxon: z
                    .string()
                    .describe("User's taxon wording (common or scientific); pass verbatim to search_nodes, do not translate from memory."),
                license_notes: z
                    .string()
                    .optional()
                    .describe("License constraints (e.g. require attribution, no commercial use)."),
            },
        },
        async ({ taxon, license_notes }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: [
                            `Find a PhyloPic silhouette for: ${taxon}.`,
                            license_notes ? `License constraints: ${license_notes}.` : "",
                            "Steps:",
                            "1. Use search_nodes with the user's exact taxon wording (do not substitute scientific names from memory). Pick a node UUID from the tool results; prefer the broadest match that fits the request.",
                            "1b. If needed, use resolve_external_ids (with list_namespaces) per https://www.phylopic.org/articles/api-recipes .",
                            "2. Use find_images with filter_clade (node UUID; includes subtaxa). Apply license filters only if license_notes require them. List pages are 0-based (page=0 first).",
                            "3. Default: first result on page 0 (PhyloPic clade order). If empty, do not retry a narrower subtaxon—subtaxa were already included. If the user asked for a typical/iconic/representative silhouette, pick a narrower node via search_nodes first (deliberate choice, not recovery).",
                            "4. Use get_image for the chosen UUID and provide exact attribution text and file URLs.",
                        ]
                            .filter(Boolean)
                            .join("\n"),
                    },
                },
            ],
        }),
    )

    server.registerPrompt(
        "cladogram_from_terminals",
        {
            description:
                "Build an illustrated SVG cladogram from a list of terminal taxa using build_tree_from_terminals, pick_image, and agent-side layout.",
            argsSchema: {
                labels: z
                    .string()
                    .describe("Comma-separated terminal taxa in top-to-bottom tip order (e.g. humans, rice, seahorses)."),
                license_notes: z.string().optional().describe("License constraints (e.g. no NonCommercial)."),
            },
        },
        async ({ labels, license_notes }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: [
                            "Create an illustrated SVG cladogram for these terminal taxa:",
                            labels,
                            license_notes ? `License constraints: ${license_notes}.` : "",
                            "Steps:",
                            "1. build_tree_from_terminals with labels split from the list (preserve order). Use returned newick with parse_newick if you want the usual Newick pipeline.",
                            "2. pick_image per node using nodeUuidByTreeId; unlabeled internals use descendant_node_uuids from child UUIDs in nodeUuidByTreeId.",
                            "3. Read phylopic://docs/cladogram-guide and layout basic rectangular phylogram SVG with measured labels and bottom-aligned silhouettes in square slots.",
                        ]
                            .filter(Boolean)
                            .join("\n"),
                    },
                },
            ],
        }),
    )

    server.registerPrompt(
        "cladogram_from_newick",
        {
            description:
                "Build an illustrated SVG cladogram from a Newick string using parse_newick, pick_image per node, and agent-side layout.",
            argsSchema: {
                newick: z.string().describe("Newick tree string."),
                license_notes: z.string().optional().describe("License constraints (e.g. no NonCommercial)."),
            },
        },
        async ({ newick, license_notes }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: [
                            "Create an illustrated SVG cladogram for this Newick tree:",
                            newick,
                            license_notes ? `License constraints: ${license_notes}.` : "",
                            "Steps:",
                            "1. parse_newick with the Newick string.",
                            "2. For each labeled node to illustrate (including internal nodes unless told otherwise): pick_image with that node's label or resolved UUID; apply license filters from the constraints (e.g. filter_license_nc=false).",
                            "2a. Unlabeled internal nodes: resolve labeled subclade root UUIDs in each child branch, then pick_image with descendant_node_uuids only (MRCA + image pick).",
                            "2b. If pick_image returns no image, omit the silhouette (label and branches only) and note the gap. Do not retry with a narrower subtaxon—filter_clade already includes subtaxa.",
                            "3. If the user asked for typical/iconic images, use search_nodes to pick a subtaxon node first, then pick_image on that UUID—not model memory.",
                            "4. Read phylopic://docs/cladogram-styles and phylopic://docs/cladogram-guide (basic phylogram; measure label sizes). Optional phylopic://docs/cladogram-template.svg.",
                            "5. You layout the tree and write the SVG (branches, linked <image href=\"vectorUrl\"> to https://www.phylopic.org/images/{uuid}, labels in <a href=\"https://www.phylopic.org/nodes/{nodeUuid}\">, attribution as needed). MCP does not compute coordinates or return SVG.",
                        ]
                            .filter(Boolean)
                            .join("\n"),
                    },
                },
            ],
        }),
    )

    return server
}
