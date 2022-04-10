import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, Name, Node, normalizeNames, UUID, validateNode } from "phylopic-source-models/src"
import { stringifyNormalized } from "phylopic-utils/src/json"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
import checkNewUUID from "./utils/checkNewUUID"
import putToMap from "./utils/putToMap"
const spawn = (
    clientData: ClientData,
    original: Entity<Node>,
    uuid: UUID,
    canonical: Name,
    ...names: readonly Name[]
): CommandResult => {
    // Check if UUID is not already in use.
    checkNewUUID(clientData, uuid)
    // Put together data for new node.
    names = normalizeNames([canonical, ...names])
    // Create and validate new node.
    const newNode: Node = {
        created: new Date().toISOString(),
        names,
        parent: original.uuid,
    }
    validateNode(newNode, true)
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
