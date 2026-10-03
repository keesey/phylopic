import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"

export const registerResources = (server: McpServer, client: PhyloPicClient) => {
    server.registerResource(
        "licenses",
        "phylopic://licenses",
        { description: "PhyloPic license list", mimeType: "application/json" },
        async () => {
            const licenses = await client.getJson("/licenses", {})
            return {
                contents: [
                    {
                        uri: "phylopic://licenses",
                        mimeType: "application/json",
                        text: JSON.stringify(licenses, undefined, 2),
                    },
                ],
            }
        },
    )

    server.registerResource(
        "namespaces",
        "phylopic://namespaces",
        { description: "Authorized external namespaces for resolve", mimeType: "application/json" },
        async () => {
            const namespaces = await client.getJson("/namespaces", {})
            return {
                contents: [
                    {
                        uri: "phylopic://namespaces",
                        mimeType: "application/json",
                        text: JSON.stringify(namespaces, undefined, 2),
                    },
                ],
            }
        },
    )

    server.registerResource(
        "node",
        new ResourceTemplate("phylopic://nodes/{uuid}", { list: undefined }),
        { description: "PhyloPic phylogenetic node", mimeType: "application/json" },
        async (uri, { uuid }) => {
            const node = await client.getJson(`/nodes/${String(uuid)}`, {})
            return {
                contents: [
                    {
                        uri: uri.href,
                        mimeType: "application/json",
                        text: JSON.stringify(node, undefined, 2),
                    },
                ],
            }
        },
    )

    server.registerResource(
        "image",
        new ResourceTemplate("phylopic://images/{uuid}", { list: undefined }),
        { description: "PhyloPic silhouette image", mimeType: "application/json" },
        async (uri, { uuid }) => {
            const image = await client.getJson(`/images/${String(uuid)}`, {
                embed_contributor: "true",
                embed_specificNode: "true",
            })
            return {
                contents: [
                    {
                        uri: uri.href,
                        mimeType: "application/json",
                        text: JSON.stringify(image, undefined, 2),
                    },
                ],
            }
        },
    )
}
