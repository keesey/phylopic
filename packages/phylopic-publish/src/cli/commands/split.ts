import { PutObjectCommand } from "@aws-sdk/client-s3"
import { isNode } from "phylopic-source-models/src/detection"
import { Entity, Node } from "phylopic-source-models/src/types"
import { stringifyNormalized } from "phylopic-utils/src/json"
import { Nomen, normalizeNomina, UUID } from "phylopic-utils/src/models"
import { stringifyNomen } from "phylopic-utils/src/nomina"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
import checkNewUUID from "./utils/checkNewUUID"
import putToMap from "./utils/putToMap"
const split = (
    clientData: CLIData,
    original: Entity<Node>,
    uuid: UUID,
    canonical: Nomen,
    ...names: readonly Nomen[]
): CommandResult => {
    // Check if UUID is not already in use.
    checkNewUUID(clientData, uuid)
    // Check if original is the root node.
    const { parent } = original.value
    if (!parent || original.uuid === clientData.source.root) {
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
        clientData: {
            ...clientData,
            nodes: putToMap(putToMap(clientData.nodes, uuid, newNode), original.uuid, updatedOriginal),
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
