import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Entity, Image, isImage, isNode, Node } from "phylopic-source-models/src"
import { normalizeNomina, stringifyNomen, stringifyNormalized, UUID } from "phylopic-utils/src"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const merge = (cliData: CLIData, conserved: Entity<Node>, suppressed: Entity<Node>): CommandResult => {
    // Check if these already match.
    if (conserved.uuid === suppressed.uuid) {
        console.warn("No change needed.")
        return { cliData, sourceUpdates: [] }
    }
    // Check if these are mergeable. Must be siblings or adjacent.
    if (
        conserved.value.parent !== suppressed.uuid &&
        suppressed.value.parent !== conserved.uuid &&
        conserved.value.parent !== suppressed.value.parent
    ) {
        throw new Error("Cannot merge nodes unless they are siblings or parent/child.")
    }
    // Collect images to update.
    const imagesToPut = new Map<UUID, Image>()
    // Create updated image map.
    const images = new Map(
        [...cliData.images.entries()].map(([uuid, image]) => {
            if (image.specific === suppressed.uuid || image.general === suppressed.uuid) {
                const general = image.general === suppressed.uuid ? conserved.uuid : image.general
                const specific = image.specific === suppressed.uuid ? conserved.uuid : image.specific
                const updated: Image = {
                    ...image,
                    general: general === specific ? undefined : general,
                    specific,
                }
                if (!isImage(updated)) {
                    throw new Error("Invalid update.")
                }
                imagesToPut.set(uuid, updated)
                console.info(`Updating image: ${JSON.stringify(uuid)}.`)
                return [uuid, updated]
            }
            return [uuid, image]
        }),
    )
    // Collect child nodes to update.
    const nodesToPut = new Map<UUID, Node>()
    // Create updated node map.
    const nodes = new Map([...cliData.nodes.entries()])
    for (const [childUUID, childNode] of cliData.nodes.entries()) {
        if (childNode.parent === suppressed.uuid) {
            const updated: Node = {
                ...childNode,
                parent: conserved.uuid,
            }
            if (!isNode(updated)) {
                throw new Error("Invalid update.")
            }
            nodesToPut.set(childUUID, updated)
            nodes.set(childUUID, updated)
        }
    }
    // Collect externals to update.
    const externalsToPut = new Map<string, Readonly<{ uuid: UUID; title: string }>>()
    // Create updated externals map.
    const externals = new Map<string, Readonly<{ uuid: UUID; title: string }>>(cliData.externals)
    for (const [path, external] of cliData.externals.entries()) {
        if (external.uuid === suppressed.uuid) {
            externalsToPut.set(path, { ...external, uuid: conserved.uuid })
            externals.set(path, { ...external, uuid: conserved.uuid })
        }
    }
    // Create and validate updated node.
    const updatedNode: Node = {
        ...conserved.value,
        names: normalizeNomina([...conserved.value.names, ...suppressed.value.names]),
        parent: conserved.value.parent === suppressed.uuid ? suppressed.value.parent : conserved.value.parent,
    }
    if (!isNode(updatedNode)) {
        throw new Error("Invalid update.")
    }
    // Update node and synonym map for conserved and suppressed.
    nodes.delete(suppressed.uuid)
    nodes.set(conserved.uuid, updatedNode)
    const link = { uuid: conserved.uuid, title: stringifyNomen(suppressed.value.names[0]) }
    externalsToPut.set(`phylopic.org/nodes/${suppressed.uuid}`, link)
    externals.set(`phylopic.org/nodes/${suppressed.uuid}`, link)
    // Return result.
    return {
        cliData: {
            ...cliData,
            images,
            nodes,
        },
        sourceUpdates: [
            ...[...imagesToPut.entries()].map(
                ([uuid, image]) =>
                    new PutObjectCommand({
                        Bucket: "source.phylopic.org",
                        Body: stringifyNormalized(image),
                        ContentType: "application/json",
                        Key: `images/${uuid}/meta.json`,
                    }),
            ),
            ...[...nodesToPut.entries()].map(
                ([uuid, node]) =>
                    new PutObjectCommand({
                        Bucket: "source.phylopic.org",
                        Body: stringifyNormalized(node),
                        ContentType: "application/json",
                        Key: `nodes/${uuid}/meta.json`,
                    }),
            ),
            ...[...externalsToPut.entries()].map(
                ([path, link]) =>
                    new PutObjectCommand({
                        Bucket: "source.phylopic.org",
                        Body: stringifyNormalized(link),
                        ContentType: "application/json",
                        Key: `externals/${path}/meta.json`,
                    }),
            ),
            new PutObjectCommand({
                Bucket: "source.phylopic.org",
                Body: stringifyNormalized(updatedNode),
                ContentType: "application/json",
                Key: `nodes/${conserved.uuid}/meta.json`,
            }),
        ],
    }
}
export default merge
