import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { PhyloPicApiError } from "../client/PhyloPicClient.js"

export const toolSuccess = (summary: string, structured: Record<string, unknown>): CallToolResult => ({
    content: [{ type: "text", text: summary }],
    structuredContent: structured,
})

export const toolFromError = (error: unknown): CallToolResult => {
    const message =
        error instanceof PhyloPicApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "An unexpected error occurred."
    return {
        content: [{ type: "text", text: message }],
        isError: true,
    }
}
