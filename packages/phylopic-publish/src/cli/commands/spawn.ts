import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, isNode, Node } from "phylopic-source-models"
import { stringifyNormalized } from "phylopic-utils/src/json"
import { Nomen, normalizeNomina, UUID } from "phylopic-utils/src/models"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
import checkNewUUID from "./utils/checkNewUUID"
import putToMap from "./utils/putToMap"
const spawn = (
    clientData: CLIData,
    original: Entity<Node>,
    uuid: UUID,
    canonical: Nomen,
    ...names: readonly Nomen[]
): CommandResult => {
    // Check if UUID is not already in use.
    checkNewUUID(clientData, uuid)
    // Put together data for new node.
    names = normalizeNomina([canonical, ...names])
    // Create and validate new node.
    const newNode: Node = {
        created: new Date().toISOString(),
        names,
        parent: original.uuid,
    }
    if (!isNode(newNode)) {
        throw new Error("Invalid new node.")
    }
    // Return result.
    return {
        clientData: {
            ...clientData,
            nodes: putToMap(clientData.nodes, uuid, newNode),
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(newNode),
                ContentType: "application/json",
                Key: `nodes/${uuid}/meta.json`,
            }),
        ],
    }
}
export default spawn
