import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { Entity, Image, Node } from "phylopic-source-models"
import { UUID } from "phylopic-utils/src/models"
import { CLIData } from "../getCLIData"
import { CommandResult, SourceUpdate } from "./CommandResult"
import succeed from "./succeed"
import deleteFromMap from "./utils/deleteFromMap"
const deleteImage = (clientData: CLIData, uuid: UUID): CommandResult => {
    return {
        clientData: {
            ...clientData,
            imageFileKeys: deleteFromMap(clientData.imageFileKeys, uuid),
            images: deleteFromMap(clientData.images, uuid),
        },
        sourceUpdates: [
            new DeleteObjectsCommand({
                Bucket: "source.phylopic.org",
                Delete: {
                    Objects: [{ Key: `images/${uuid}/meta.json` }, { Key: clientData.imageFileKeys.get(uuid) }],
                },
            }),
        ],
    }
}
const deleteNode = (clientData: CLIData, uuid: UUID): CommandResult => {
    // Retrieve node.
    const node = clientData.nodes.get(uuid)
    if (!node) {
        throw new Error("Invalid node.")
    }
    // Look up parent.
    const parentUUID = node.parent
    const parent = parentUUID ? clientData.nodes.get(node.parent) : undefined
    // Make sure this isn't the root.
    if (uuid === clientData.source.root) {
        throw new Error("Cannot delete the root node.")
    }
    // Collect results from reassigning child nodes to parent node.
    const result = { clientData, sourceUpdates: [] as SourceUpdate[] }
    const children = [...clientData.nodes.entries()].filter(([, node]) => node.parent === uuid)
    for (const [childUUID, childNode] of children) {
        if (!parent || !parentUUID) {
            throw new Error("Cannot delete an unrooted node with children.")
        } else {
            const succeedResult = succeed(
                result.clientData,
                { uuid: parentUUID, value: parent },
                { uuid: childUUID, value: childNode },
            )
            // Return result.
            result.clientData = succeedResult.clientData
            result.sourceUpdates.push(...succeedResult.sourceUpdates)
        }
    }
    // Collect externals
    const externalPaths = [...clientData.externals.entries()]
        .filter(([, link]) => link.uuid === uuid)
        .map(([path]) => path)
    return {
        clientData: {
            ...result.clientData,
            nodes: deleteFromMap(result.clientData.nodes, uuid),
        },
        sourceUpdates: [
            ...result.sourceUpdates,
            new DeleteObjectsCommand({
                Bucket: "source.phylopic.org",
                Delete: {
                    Objects: [
                        { Key: `nodes/${uuid}/meta.json` },
                        ...externalPaths.map(externalPath => ({ Key: `externals/${externalPath}/meta.json` })),
                    ],
                },
            }),
        ],
    }
}
const deleteEntity = (clientData: CLIData, entity: Entity<Image | Node>): CommandResult => {
    if (clientData.images.has(entity.uuid)) {
        return deleteImage(clientData, entity.uuid)
    }
    if (clientData.nodes.has(entity.uuid)) {
        return deleteNode(clientData, entity.uuid)
    }
    console.warn("No change needed.")
    return { clientData, sourceUpdates: [] }
}
export default deleteEntity
