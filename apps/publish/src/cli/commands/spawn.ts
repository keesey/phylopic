import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, isNode, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { Nomen, normalizeNomina, stringifyNormalized, UUID } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
import checkNewUUID from "./utils/checkNewUUID.js"
import putToMap from "./utils/putToMap.js"
const spawn = (
    cliData: CLIData,
    original: Entity<Node>,
    uuid: UUID,
    canonical: Nomen,
    ...names: readonly Nomen[]
): CommandResult => {
    // Check if UUID is not already in use.
    checkNewUUID(cliData, uuid)
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
        cliData: {
            ...cliData,
            nodes: putToMap(cliData.nodes, uuid, newNode),
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Body: stringifyNormalized(newNode),
                ContentType: "application/json",
                Key: `nodes/${uuid}/meta.json`,
            }),
        ],
    }
}
export default spawn
