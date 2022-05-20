import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "@phylopic/api-models"
import { Entity, Image, isImage, isNode, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { normalizeNomina, stringifyNomen, stringifyNormalized, UUID } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
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
                    general: general === specific ? null : general,
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
    const externalsToPut = new Map<string, TitledLink>()
    // Create updated externals map.
    const externals = new Map<string, TitledLink>(cliData.externals)
    for (const [identifier, external] of cliData.externals.entries()) {
        if (external.href === `/nodes/${suppressed.uuid}`) {
            externalsToPut.set(identifier, { ...external, href: `/nodes/${conserved.uuid}` })
            externals.set(identifier, { ...external, href: `/nodes/${conserved.uuid}` })
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
    const link: TitledLink = { href: `/nodes/${conserved.uuid}`, title: stringifyNomen(suppressed.value.names[0]) }
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
                        Bucket: SOURCE_BUCKET_NAME,
                        Body: stringifyNormalized(image),
                        ContentType: "application/json",
                        Key: `images/${uuid}/meta.json`,
                    }),
            ),
            ...[...nodesToPut.entries()].map(
                ([uuid, node]) =>
                    new PutObjectCommand({
                        Bucket: SOURCE_BUCKET_NAME,
                        Body: stringifyNormalized(node),
                        ContentType: "application/json",
                        Key: `nodes/${uuid}/meta.json`,
                    }),
            ),
            ...[...externalsToPut.entries()].map(
                ([identifier, link]) =>
                    new PutObjectCommand({
                        Bucket: SOURCE_BUCKET_NAME,
                        Body: stringifyNormalized(link),
                        ContentType: "application/json",
                        Key: `externals/${identifier}/meta.json`,
                    }),
            ),
            new PutObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Body: stringifyNormalized(updatedNode),
                ContentType: "application/json",
                Key: `nodes/${conserved.uuid}/meta.json`,
            }),
            new DeleteObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Key: `nodes/${suppressed.uuid}/meta.json`,
            }),
        ],
    }
}
export default merge
