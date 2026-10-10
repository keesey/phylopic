import type { ImageWithEmbedded } from "@phylopic/api-models"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import {
    buildDiagramPublication,
    diagramWidthForPublication,
    type DiagramPublication,
} from "../collection/diagramPublication.js"
import { describeImageSetUsage } from "../collection/describeImageSetUsage.js"
import type { ImageForAttribution } from "../collection/formatAttribution.js"

/** License footer + metadata for a diagram that uses the given silhouette image UUIDs. */
export const buildDiagramPublicationForImageUuids = async (
    client: PhyloPicClient,
    imageUuids: readonly string[],
    diagramTitle: string,
    contentWidth: number,
): Promise<DiagramPublication & { viewBoxWidth: number }> => {
    if (!imageUuids.length) {
        throw new Error("buildDiagramPublicationForImageUuids requires at least one image UUID.")
    }
    const embedded = await Promise.all(
        imageUuids.map(uuid =>
            client.getJson<ImageWithEmbedded>(`/images/${uuid}`, { embed_specificNode: "true" }),
        ),
    )
    const images = embedded as unknown as readonly ImageForAttribution[]
    const usage = describeImageSetUsage(images)
    let footerWidth = contentWidth - 48
    let attributionMode: "full_text" | "permalink" | undefined
    let attributionUrl: string | undefined
    if (usage.attributionRequired) {
        const { collectionUuid: newUuid } = await client.createCollection([...imageUuids])
        const permalink = await client.createCollectionPermalink(newUuid)
        attributionMode = "permalink"
        attributionUrl = permalink.permalinkUrl
    }
    let publicationBuilt = buildDiagramPublication({
        usage,
        images,
        footerWidth,
        attributionMode,
        attributionUrl,
        imageUuids,
        diagramTitle,
    })
    let viewBoxWidth = diagramWidthForPublication(contentWidth, 24, publicationBuilt)
    if (viewBoxWidth > contentWidth) {
        footerWidth = viewBoxWidth - 48
        publicationBuilt = buildDiagramPublication({
            usage,
            images,
            footerWidth,
            attributionMode,
            attributionUrl,
            imageUuids,
            diagramTitle,
        })
    }
    return { ...publicationBuilt, viewBoxWidth }
}
