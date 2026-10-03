import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
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
                taxon: z.string().describe("Scientific or common name, or external ID context."),
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
                            "1. Use search_nodes or resolve_external_ids (with list_namespaces) to identify the best PhyloPic node.",
                            "2. Use find_images with appropriate filter_name, filter_node, or filter_clade and license filters.",
                            "3. Use get_image for the chosen UUID and provide exact attribution text and file URLs.",
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
