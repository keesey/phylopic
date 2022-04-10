import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, Image, Node, validateImage } from "phylopic-source-models/src"
import { stringifyNormalized } from "phylopic-utils/src/json"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
import precedes from "./utils/precedes"
import putToMap from "./utils/putToMap"
const identify = (
    clientData: ClientData,
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
        return { clientData, sourceUpdates: [] }
    }
    // Check that general precedes specific, if present.
    if (general && !precedes(clientData.nodes, general.uuid, specific.uuid)) {
        throw new Error("General node does not precede specific node.")
    }
    // Create and validate updated image.
    const updatedImage: Image = {
        ...image.value,
        specific: specific.uuid,
        general: general?.uuid,
    }
    validateImage(updatedImage, true)
    // Return result.
    return {
        clientData: {
            ...clientData,
            images: putToMap(clientData.images, image.uuid, updatedImage),
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(updatedImage),
                ContentType: "application/json",
                Key: `images/${image.uuid}/meta.json`,
            }),
        ],
    }
}
export default identify
