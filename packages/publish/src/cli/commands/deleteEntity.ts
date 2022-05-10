import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { Entity, Image, Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult, SourceUpdate } from "./CommandResult.js"
import succeed from "./succeed.js"
import deleteFromMap from "./utils/deleteFromMap.js"
const deleteImage = (cliData: CLIData, uuid: UUID): CommandResult => {
    return {
        cliData: {
            ...cliData,
            imageFileKeys: deleteFromMap(cliData.imageFileKeys, uuid),
            images: deleteFromMap(cliData.images, uuid),
        },
        sourceUpdates: [
            new DeleteObjectsCommand({
                Bucket: "source.phylopic.org",
                Delete: {
                    Objects: [{ Key: `images/${uuid}/meta.json` }, { Key: cliData.imageFileKeys.get(uuid) }],
                },
            }),
        ],
    }
}
const deleteNode = (cliData: CLIData, uuid: UUID): CommandResult => {
    // Retrieve node.
    const node = cliData.nodes.get(uuid)
    if (!node) {
        throw new Error("Invalid node.")
    }
    // Look up parent.
    const parentUUID = node.parent
    const parent = parentUUID ? cliData.nodes.get(node.parent) : undefined
    // Make sure this isn't the root.
    if (uuid === cliData.source.root) {
        throw new Error("Cannot delete the root node.")
    }
    // Collect results from reassigning child nodes to parent node.
    const result = { cliData, sourceUpdates: [] as SourceUpdate[] }
    const children = [...cliData.nodes.entries()].filter(([, node]) => node.parent === uuid)
    for (const [childUUID, childNode] of children) {
        if (!parent || !parentUUID) {
            throw new Error("Cannot delete an unrooted node with children.")
        } else {
            const succeedResult = succeed(
                result.cliData,
                { uuid: parentUUID, value: parent },
                { uuid: childUUID, value: childNode },
            )
            // Return result.
            result.cliData = succeedResult.cliData
            result.sourceUpdates.push(...succeedResult.sourceUpdates)
        }
    }
    // Collect externals
    const externalPaths = [...cliData.externals.entries()]
        .filter(([, link]) => link.uuid === uuid)
        .map(([path]) => path)
    return {
        cliData: {
            ...result.cliData,
            nodes: deleteFromMap(result.cliData.nodes, uuid),
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
const deleteEntity = (cliData: CLIData, entity: Entity<Image | Node>): CommandResult => {
    if (cliData.images.has(entity.uuid)) {
        return deleteImage(cliData, entity.uuid)
    }
    if (cliData.nodes.has(entity.uuid)) {
        return deleteNode(cliData, entity.uuid)
    }
    console.warn("No change needed.")
    return { cliData, sourceUpdates: [] }
}
export default deleteEntity
