import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, Name, Node, normalizeNames, stringifyNormalized, UUID, validateNode } from "phylopic-source-models/src"
import stringifyName from "../../phylopicv2/stringifyName"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
import checkNewUUID from "./utils/checkNewUUID"
import putToMap from "./utils/putToMap"
const split = (
    clientData: ClientData,
    original: Entity<Node>,
    uuid: UUID,
    canonical: Name,
    ...names: ReadonlyArray<Name>
): CommandResult => {
    // Check if UUID is not already in use.
    checkNewUUID(clientData, uuid)
    // Check if original is the root node.
    const { parent } = original.value
    if (!parent || original.uuid === clientData.main.root) {
        throw new Error("Cannot split the root node.")
    }
    // Put together data for new node.
    names = normalizeNames([canonical, ...names])
    // Put together data for comparisons.
    const originalNameStrings = original.value.names.map(stringifyName)
    const nameStrings = names.map(stringifyName)
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
        names: original.value.names.filter(name => !nameStrings.includes(stringifyName(name))),
    }
    validateNode(updatedOriginal, true)
    // Create and validate new node.
    const newNode: Node = {
        ...original.value,
        created: new Date().toISOString(),
        names,
    }
    validateNode(newNode, true)
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
