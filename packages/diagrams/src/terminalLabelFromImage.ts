import type { ImageWithEmbedded } from "@phylopic/api-models"
import { shortenNomen, stringifyNomen } from "@phylopic/utils"
import { nodeUuidFromSpecificNodeLink } from "./imageRecord.js"
import { nodeTitle } from "./nodeTitle.js"

export const terminalLabelFromImage = (image: ImageWithEmbedded): string => {
    const node = image._embedded?.specificNode
    const nomen = node?.names?.[0]
    if (nomen) {
        return stringifyNomen(shortenNomen(nomen))
    }
    const title = node ? nodeTitle(node)?.trim() : undefined
    if (title) {
        return title
    }
    const nodeUuid = nodeUuidFromSpecificNodeLink(image)
    return nodeUuid ?? String(image.uuid)
}
