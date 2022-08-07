import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, isNode, Node } from "@phylopic/source-models"
import { stringifyNormalized } from "@phylopic/utils"
import SOURCE_BUCKET_NAME from "../../paths/SOURCE_BUCKET_NAME.js"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
import precedes from "./utils/precedes.js"
import putToMap from "./utils/putToMap.js"
const succeed = (cliData: CLIData, parent: Entity<Node>, child: Entity<Node>): CommandResult => {
    // Check if parent and child are the same.
    if (parent.uuid === child.value.parent) {
        console.warn("No change needed.")
        return { cliData, sourceUpdates: [] }
    }
    // Check if child is a predecessor of parent.
    if (precedes(cliData.nodes, child.uuid, parent.uuid)) {
        throw new Error("This would create a cycle.")
    }
    // Create and validate updated child node.
    const updatedChild: Node = {
        ...child.value,
        parent: parent.uuid ?? null,
    }
    if (!isNode(updatedChild)) {
        throw new Error("Invalid update for child node.")
    }
    // Update nodes map.
    const nodes = putToMap(cliData.nodes, child.uuid, updatedChild)
    // See any any image identifications are rendered inapplicable by this.
    const conflicts = [...cliData.images.entries()].filter(
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
        cliData: {
            ...cliData,
            nodes,
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Body: stringifyNormalized(updatedChild),
                ContentType: "application/json",
                Key: `nodes/${child.uuid}/meta.json`,
            }),
        ],
    }
}
export default succeed
