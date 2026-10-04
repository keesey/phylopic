import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { ImageWithEmbedded } from "@phylopic/api-models"
import { z } from "zod"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { describeImageSetUsage } from "../collection/describeImageSetUsage.js"
import {
    phylopicCollectionPageUrl,
    phylopicCollectionPermalinkRequestUrl,
} from "../cladogram/phylopicWebUrls.js"
import { toolFromError, toolSuccess } from "./toolResult.js"

const uuidSchema = z.string().uuid()

const imageUuidsSchema = z
    .array(uuidSchema)
    .min(1)
    .max(512)
    .describe("Image UUIDv4s to include in the collection or usage summary.")

export const registerCollectionTools = (server: McpServer, client: PhyloPicClient) => {
    server.registerTool(
        "describe_image_set_usage",
        {
            description:
                "License and attribution text for a set of silhouette images (same rules as a PhyloPic collection usage page). Fetches each image with specificNode embedded. Use before publishing multi-image work (e.g. cladograms).",
            inputSchema: { image_uuids: imageUuidsSchema },
            annotations: { readOnlyHint: true },
        },
        async ({ image_uuids }) => {
            try {
                const images = await Promise.all(
                    image_uuids.map(uuid =>
                        client.getJson<ImageWithEmbedded>(`/images/${uuid}`, { embed_specificNode: "true" }),
                    ),
                )
                const usage = describeImageSetUsage(images)
                return toolSuccess(`Usage for ${images.length} image(s).`, usage)
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "create_collection",
        {
            description:
                "Register a set of image UUIDs as a PhyloPic collection (POST api.phylopic.org/collections). Returns the deterministic collection UUID and www collection page URL. Rate-limited by the API.",
            inputSchema: { image_uuids: imageUuidsSchema },
        },
        async ({ image_uuids }) => {
            try {
                const { collectionUuid, href } = await client.createCollection(image_uuids)
                const collectionPageUrl = phylopicCollectionPageUrl(collectionUuid)
                return toolSuccess(`Collection ${collectionUuid} registered.`, {
                    collectionUuid,
                    href,
                    collectionPageUrl,
                    imageCount: image_uuids.length,
                    permalinkRequestUrl: phylopicCollectionPermalinkRequestUrl(collectionUuid),
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "create_collection_permalink",
        {
            description:
                "Create a stable attribution permalink for a collection via www.phylopic.org (GET /api/permalinks/collections/{uuid}). Not on the public API; rate-limited per IP. Use when attribution is required and you want a short credit link instead of listing every contributor.",
            inputSchema: { collection_uuid: uuidSchema },
        },
        async ({ collection_uuid }) => {
            try {
                const permalink = await client.createCollectionPermalink(collection_uuid)
                return toolSuccess(`Permalink for collection ${collection_uuid}.`, {
                    collectionUuid: collection_uuid,
                    ...permalink,
                    collectionPageUrl: phylopicCollectionPageUrl(collection_uuid),
                })
            } catch (error) {
                return toolFromError(error)
            }
        },
    )
}
