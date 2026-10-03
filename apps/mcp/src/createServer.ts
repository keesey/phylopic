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
                            "2. Use find_images with filter_clade (node UUID). Apply license filters only if license_notes require them. List pages are 0-based (page=0 first).",
                            "3. If no specific image was requested, take the first result on page 0 (PhyloPic clade order), not a subjectively typical species.",
                            "4. Use get_image for the chosen UUID and provide exact attribution text and file URLs.",
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
