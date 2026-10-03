import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { createMcpServer } from "./createServer.js"

const HOST = "127.0.0.1"
const DEFAULT_PORT = 3004

const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10)

const app = createMcpExpressApp({ host: HOST })

const methodNotAllowed = (message: string) => ({
    jsonrpc: "2.0" as const,
    error: { code: -32_000, message },
    id: null,
})

app.post("/mcp", async (request, response) => {
    const server = createMcpServer()
    try {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        })
        await server.connect(transport)
        await transport.handleRequest(request, response, request.body)
        response.on("close", () => {
            void transport.close()
            void server.close()
        })
    } catch (error) {
        console.error("Error handling MCP request:", error)
        if (!response.headersSent) {
            response.status(500).json({
                jsonrpc: "2.0",
                error: { code: -32_603, message: "Internal server error" },
                id: null,
            })
        }
    }
})

app.get("/mcp", (_request, response) => {
    response.status(405).json(methodNotAllowed("Method not allowed."))
})

app.delete("/mcp", (_request, response) => {
    response.status(405).json(methodNotAllowed("Method not allowed."))
})

app.listen(port, HOST, error => {
    if (error) {
        console.error("Failed to start MCP HTTP server:", error)
        process.exit(1)
    }
    console.error(`PhyloPic MCP server listening on http://${HOST}:${port}/mcp`)
})

process.on("SIGINT", () => {
    process.exit(0)
})
