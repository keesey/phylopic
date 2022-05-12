import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, Image, isImage, Node } from "@phylopic/source-models"
import { stringifyNormalized } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
import precedes from "./utils/precedes.js"
import putToMap from "./utils/putToMap.js"
const identify = (
    cliData: CLIData,
    image: Entity<Image>,
    specific: Entity<Node>,
    general?: Entity<Node>,
): CommandResult => {
    // Check if the nodes are the same.
    if (general?.uuid === specific.uuid) {
        console.warn("Nodes are the same. Treating general node as undefined.")
        general = undefined
    }
    // Check if any change is needed.
    if (image.value.specific === specific.uuid && image.value.general === general?.uuid) {
        console.warn("No change needed.")
        return { cliData, sourceUpdates: [] }
    }
    // Check that general precedes specific, if present.
    if (general && !precedes(cliData.nodes, general.uuid, specific.uuid)) {
        throw new Error("General node does not precede specific node.")
    }
    // Create and validate updated image.
    const updatedImage: Image = {
        ...image.value,
        specific: specific.uuid,
        general: general?.uuid ?? null,
    }
    if (!isImage(updatedImage)) {
        throw new Error("Invalid image update.")
    }
    // Return result.
    return {
        cliData: {
            ...cliData,
            images: putToMap(cliData.images, image.uuid, updatedImage),
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Body: stringifyNormalized(updatedImage),
                ContentType: "application/json",
                Key: `images/${image.uuid}/meta.json`,
            }),
        ],
    }
}
export default identify
