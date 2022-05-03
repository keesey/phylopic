import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, isNode, Node } from "@phylopic/source-models"
import { Nomen, normalizeNomina, stringifyNormalized, UUID } from "@phylopic/utils"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
import checkNewUUID from "./utils/checkNewUUID"
import putToMap from "./utils/putToMap"
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
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(newNode),
                ContentType: "application/json",
                Key: `nodes/${uuid}/meta.json`,
            }),
        ],
    }
}
export default spawn
