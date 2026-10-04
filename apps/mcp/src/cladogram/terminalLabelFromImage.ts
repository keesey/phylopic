import type { ImageWithEmbedded } from "@phylopic/api-models"
import { shortenNomen, stringifyNomen } from "@phylopic/utils"
import { nodeUuidFromSpecificNodeLink } from "./imageRecord.js"

/** Cladogram tip label from an image’s specific node (no author/year citations). */
export const terminalLabelFromImage = (image: ImageWithEmbedded): string => {
    const node = image._embedded?.specificNode
    const nomen = node?.names?.[0]
    if (nomen) {
        return stringifyNomen(shortenNomen(nomen))
    }
    if (node?.title?.trim()) {
        return node.title.trim()
    }
    const nodeUuid = nodeUuidFromSpecificNodeLink(image)
    return nodeUuid ?? String(image.uuid)
}
