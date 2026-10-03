import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { readPackageDoc } from "./packageDocs.js"

export const registerResources = (server: McpServer, client: PhyloPicClient) => {
    server.registerResource(
        "cladogram-guide",
        "phylopic://docs/cladogram-guide",
        {
            description:
                "Living agent guide: Newick → parse_newick → pick_image → SVG layout, exact name match, label-only nodes without images, attribution. Markdown.",
            mimeType: "text/markdown",
        },
        async () => {
            const text = await readPackageDoc("cladogram-for-agents.md")
            return {
                contents: [{ uri: "phylopic://docs/cladogram-guide", mimeType: "text/markdown", text }],
            }
        },
    )

    server.registerResource(
        "cladogram-styles",
        "phylopic://docs/cladogram-styles",
        {
            description:
                "Catalog of cladogram layout styles (basic rectangular phylogram supported; radial etc. planned). Markdown.",
            mimeType: "text/markdown",
        },
        async () => {
            const text = await readPackageDoc("cladogram-styles.md")
            return {
                contents: [{ uri: "phylopic://docs/cladogram-styles", mimeType: "text/markdown", text }],
            }
        },
    )

    server.registerResource(
        "cladogram-template",
        "phylopic://docs/cladogram-template.svg",
        {
            description: "Minimal rectangular phylogram SVG skeleton (placeholder URLs). Not a real tree.",
            mimeType: "image/svg+xml",
        },
        async () => {
            const text = await readPackageDoc("cladogram-template.svg")
            return {
                contents: [{ uri: "phylopic://docs/cladogram-template.svg", mimeType: "image/svg+xml", text }],
            }
        },
    )

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
