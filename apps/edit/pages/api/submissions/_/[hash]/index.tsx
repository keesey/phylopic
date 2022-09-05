import { handleAPIError, handleWithPatcher } from "@phylopic/source-client"
import { Node, Submission } from "@phylopic/source-models"
import { getIdentifierParts, Hash, isHash, normalizeUUID, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import { parseNomen } from "parse-nomen"
import getResolver from "~/resolvers/getResolver"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Submission | { uuid: UUID }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { hash } = req.query
        if (!isHash(hash)) {
            throw 404
        }
        client = new SourceClient()
        if (req.method === "POST") {
            const uuid = await accept(client, hash)
            res.setHeader("location", `/images/${encodeURIComponent(uuid)}`)
            res.json({ uuid })
            res.status(200)
        } else if (req.method === "OPTIONS") {
            res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT")
            res.status(204)
        } else {
            await handleWithPatcher(req, res, client.submission(hash))
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
const accept = async (client: SourceClient, hash: Hash): Promise<UUID> => {
    const now = new Date().toISOString()
    const submission = await client.submission(hash).get()
    if (submission.status !== "submitted") {
        throw 409
    }
    const [authority, namespace, objectID] = getIdentifierParts(submission.identifier)
    const resolver = getResolver(authority, namespace)
    if (!resolver) {
        console.warn("Unrecognized namespace: ", [authority, namespace].map(x => encodeURIComponent(x)).join("/"))
        throw 400
    }
    const identifiedNode = await resolver(client, objectID)
    let node: Node & { uuid: UUID }
    if (submission.newTaxonName) {
        let nodeUUID: UUID
        do {
            nodeUUID = normalizeUUID(randomUUID())
        } while (await client.node(nodeUUID).exists())
        node = {
            created: now,
            modified: now,
            names: [parseNomen(submission.newTaxonName)],
            parent: identifiedNode.uuid,
            uuid: nodeUUID,
        }
        await client.node(nodeUUID).put(node)
    } else {
        node = identifiedNode
    }
    let uuid: UUID
    do {
        uuid = normalizeUUID(randomUUID())
    } while (await client.image(uuid).exists())
    await client.image(uuid).put({
        attribution: submission.attribution,
        contributor: submission.contributor,
        created: submission.created,
        general: null,
        license: submission.license,
        modified: submission.created,
        specific: node.uuid,
        sponsor: submission.sponsor,
        uuid,
    })
    await client.submission(hash).delete()
    return uuid
}
