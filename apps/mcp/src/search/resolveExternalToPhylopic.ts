import type { ResolveToPhylopic } from "@phylopic/search"
import { PhyloPicApiError, type PhyloPicClient } from "../client/PhyloPicClient.js"

export const createResolveToPhylopic = (client: PhyloPicClient): ResolveToPhylopic => {
    return async (authority, namespace, objectIDs) => {
        try {
            const { link, node } = await client.resolveExternal(authority, namespace, objectIDs, false)
            const uuid = typeof node === "object" && node !== null && "uuid" in node ? String(node.uuid) : undefined
            return { href: link.href, title: link.title, uuid }
        } catch (error) {
            if (error instanceof PhyloPicApiError && error.status === 404) {
                return null
            }
            throw error
        }
    }
}
