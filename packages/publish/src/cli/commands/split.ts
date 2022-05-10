import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, isNode, Node } from "@phylopic/source-models"
import { Nomen, normalizeNomina, stringifyNomen, stringifyNormalized, UUID } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
import checkNewUUID from "./utils/checkNewUUID.js"
import putToMap from "./utils/putToMap.js"
const split = (
    cliData: CLIData,
    original: Entity<Node>,
    uuid: UUID,
    canonical: Nomen,
    ...names: readonly Nomen[]
): CommandResult => {
    // Check if UUID is not already in use.
    checkNewUUID(cliData, uuid)
    // Check if original is the root node.
    const { parent } = original.value
    if (!parent || original.uuid === cliData.source.root) {
        throw new Error("Cannot split the root node.")
    }
    // Put together data for new node.
    names = normalizeNomina([canonical, ...names])
    // Put together data for comparisons.
    const originalNameStrings = original.value.names.map(stringifyNomen)
    const nameStrings = names.map(stringifyNomen)
    // Do not move original's canonical name.
    if (nameStrings.includes(originalNameStrings[0])) {
        throw new Error("Cannot move canonical name to new node.")
    }
    // Do not create a new name.
    if (nameStrings.some(nameString => !originalNameStrings.includes(nameString))) {
        throw new Error("All names must be present in original node.")
    }
    // Create and validate updated original node.
    const updatedOriginal: Node = {
        ...original.value,
        names: original.value.names.filter(name => !nameStrings.includes(stringifyNomen(name))),
    }
    if (!isNode(updatedOriginal)) {
        throw new Error("Invalid update for original node.")
    }
    // Create and validate new node.
    const newNode: Node = {
        ...original.value,
        created: new Date().toISOString(),
        names,
    }
    if (!isNode(newNode)) {
        throw new Error("Invalid new node.")
    }
    // Return result.
    return {
        cliData: {
            ...cliData,
            nodes: putToMap(putToMap(cliData.nodes, uuid, newNode), original.uuid, updatedOriginal),
        },
        sourceUpdates: [
            new PutObjectCommand({
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(updatedOriginal),
                ContentType: "application/json",
                Key: `nodes/${original.uuid}/meta.json`,
            }),
            new PutObjectCommand({
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(newNode),
                ContentType: "application/json",
                Key: `nodes/${uuid}/meta.json`,
            }),
        ],
    }
}
export default split
