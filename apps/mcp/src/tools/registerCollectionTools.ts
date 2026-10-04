import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { ImageWithEmbedded } from "@phylopic/api-models"
import { z } from "zod"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { buildDiagramPublication, type DiagramAttributionMode } from "../collection/diagramPublication.js"
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
        "format_diagram_publication",
        {
            description:
                "Build license footer copy, SVG footer fragment (Roboto), and RDF metadata for a diagram that uses PhyloPic silhouettes. License defaults to describe_image_set_usage combinedLicenseUrl; optional license_url must be equally or more restrictive. Published diagrams: use permalink (after create_collection + create_collection_permalink) when attribution is required—not collection page URLs. Optional full_text for drafts; optional user_attribution_note for the user's layout work.",
            inputSchema: {
                image_uuids: imageUuidsSchema,
                license_url: z.string().url().optional(),
                attribution_mode: z
                    .enum(["full_text", "permalink"])
                    .optional()
                    .describe("permalink when attribution is required on published work (default full_text)."),
                attribution_url: z
                    .string()
                    .url()
                    .optional()
                    .describe("Permalink URL from create_collection_permalink when attribution_mode is permalink."),
                user_attribution_note: z.string().optional(),
                diagram_title: z.string().optional(),
                footer_width: z
                    .number()
                    .positive()
                    .optional()
                    .describe("Max width in px for wrapped footer text (default 640)."),
            },
            annotations: { readOnlyHint: true },
        },
        async ({
            image_uuids,
            license_url,
            attribution_mode,
            attribution_url,
            user_attribution_note,
            diagram_title,
            footer_width,
        }) => {
            try {
                const images = await Promise.all(
                    image_uuids.map(uuid =>
                        client.getJson<ImageWithEmbedded>(`/images/${uuid}`, { embed_specificNode: "true" }),
                    ),
                )
                const usage = describeImageSetUsage(images)
                const publication = buildDiagramPublication({
                    usage,
                    images,
                    footerWidth: footer_width,
                    licenseUrl: license_url,
                    attributionMode: attribution_mode as DiagramAttributionMode | undefined,
                    attributionUrl: attribution_url,
                    userAttributionNote: user_attribution_note,
                    diagramTitle: diagram_title,
                    imageUuids: image_uuids,
                })
                return toolSuccess(
                    "Diagram publication text and SVG fragments. Expand diagram width to at least publication.footerMinWidth plus twice footer horizontal padding.",
                    { usage, publication },
                )
            } catch (error) {
                return toolFromError(error)
            }
        },
    )

    server.registerTool(
        "create_collection",
        {
            description:
                "Register a set of image UUIDs as a PhyloPic collection (POST api.phylopic.org/collections). Required before create_collection_permalink; do not cite the collection page URL on diagrams—use the permalink instead. Rate-limited by the API.",
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
