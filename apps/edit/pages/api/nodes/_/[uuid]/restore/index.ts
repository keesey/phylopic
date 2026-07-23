import { handleAPIError } from "@phylopic/source-client"
import { External, Node } from "@phylopic/source-models"
import { isUUIDv4, normalizeUUID, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import { parseNomen } from "parse-nomen"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Node | { uuid: UUID }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const uuid = normalizeUUID(typeof req.query.uuid === "string" ? req.query.uuid : undefined)
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        if (req.method === "POST") {
            client = new SourceClient()
            const node = client.node(uuid)
            const external = client.external("phylopic.org", "nodes", uuid)
            const result = await restoreNode(node, external, uuid)
            await external.delete()
            res.setHeader("location", `/nodes/${encodeURIComponent(uuid)}`)
            res.json(result)
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
const restoreNode = async (
    node: ReturnType<SourceClient["node"]>,
    external: ReturnType<SourceClient["external"]>,
    uuid: UUID,
): Promise<Node | { uuid: UUID }> => {
    if (await node.exists()) {
        console.debug("Node already exists.")
        return node.get()
    }
    if (await node.isRestorable()) {
        console.debug("Node can be fully restored.")
        return node.restore()
    }
    if (await external.exists()) {
        console.debug("Node can be restored from external.")
        return createNodeFromExternal(node, await external.get(), uuid)
    }
    if (await external.isRestorable()) {
        console.debug("Node can be restored from temporarily restored external.")
        return createNodeFromExternal(node, await external.restore(), uuid)
    }
    throw 404
}
const createNodeFromExternal = async (
    client: ReturnType<SourceClient["node"]>,
    external: External,
    uuid: UUID,
): Promise<Node & { uuid: UUID }> => {
    const now = new Date().toISOString()
    const node = {
        created: now,
        modified: now,
        names: [parseNomen(external.title)],
        parent: external.node,
        uuid,
    }
    await client.put(node)
    return node
}
