import { handleAPIError } from "@phylopic/source-client"
import { Entity, Node, Submission } from "@phylopic/source-models"
import { Authority, isAuthority, isNamespace, isObjectID, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import getResolver from "~/resolvers/getResolver"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Submission | { uuid: UUID }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { authority, namespace, objectID } = req.query
        if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectID)) {
            throw 404
        }
        console.debug({ authority, namespace, objectID })
        client = new SourceClient()
        if (req.method === "POST") {
            const node = await importNode(client, authority, namespace, objectID)
            res.setHeader("location", `/nodes/${encodeURIComponent(node.uuid)}`)
            res.json(node)
            res.status(200)
        } else if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.status(204)
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
const importNode = async (
    client: SourceClient,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<Entity<Node>> => {
    const existing = await client.external(authority, namespace, objectID).exists()
    let node: Node & { uuid: UUID }
    if (existing) {
        const current = await client.external(authority, namespace, objectID).get()
        node = await client.node(current.node).get()
    } else {
        const resolver = getResolver(authority, namespace)
        if (!resolver) {
            console.warn("Unrecognized namespace: ", [authority, namespace].map(x => encodeURIComponent(x)).join("/"))
            throw 400
        }
        node = await resolver(client, objectID)
    }
    return {
        uuid: node.uuid,
        value: node,
    }
}
