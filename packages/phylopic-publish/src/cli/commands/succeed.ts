import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, Node, validateNode } from "phylopic-source-models/src"
import { stringifyNormalized } from "phylopic-utils/src/json"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
import precedes from "./utils/precedes"
import putToMap from "./utils/putToMap"
const succeed = (clientData: ClientData, parent: Entity<Node>, child: Entity<Node>): CommandResult => {
    // Check if parent and child are the same.
    if (parent.uuid === child.value.parent) {
        console.warn("No change needed.")
        return { clientData, sourceUpdates: [] }
    }
    // Check if child is a predecessor of parent.
    if (precedes(clientData.nodes, child.uuid, parent.uuid)) {
        throw new Error("This would create a cycle.")
    }
    // Create and validate updated child node.
    const updatedChild: Node = {
        ...child.value,
        parent: parent.uuid,
    }
    validateNode(updatedChild, true)
    // Update nodes map.
    const nodes = putToMap(clientData.nodes, child.uuid, updatedChild)
    // See any any image identifications are rendered inapplicable by this.
    const conflicts = [...clientData.images.entries()].filter(
        ([, image]) => image.general && !precedes(nodes, image.general, image.specific),
    )
    if (conflicts.length > 0) {
        throw new Error(
            `The following image${conflicts.length === 1 ? "" : "s"} need${
                conflicts.length === 1 ? "s" : ""
            } to be reidentified first:${conflicts.map(([uuid]) => `\n\t- ${JSON.stringify(uuid)}`).join("")}`,
        )
    }
    // Return result.
    return {
        clientData: {
            ...clientData,
            nodes,
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(updatedChild),
                ContentType: "application/json",
                Key: `nodes/${child.uuid}/meta.json`,
            }),
        ],
    }
}
export default succeed