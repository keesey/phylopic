import { randomUUID } from "crypto"
import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { isNode, Node } from "@phylopic/source-models"
import { normalizeUUID, UUID, ValidationError, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<(Node & { uuid: UUID }) | Page<Node & { uuid: UUID }, number> | number> = async (
    req,
    res,
) => {
    let client: SourceClient | undefined
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, HEAD, OPTIONS, POST")
            res.status(204)
        } else if (req.method === "POST") {
            const now = new Date()
            const node = {
                created: now.toISOString(),
                modified: now.toISOString(),
                ...req.body,
            }
            const collector = new ValidationFaultCollector()
            if (!isNode(node, collector)) {
                throw new ValidationError(collector.list(), "Expected a partial node.")
            }
            client = new SourceClient()
            let uuid: UUID
            do {
                uuid = normalizeUUID(randomUUID())
            } while (await client.node(uuid).exists())
            const result = { ...node, uuid }
            await client.node(uuid).put(result)
            res.json(result)
        } else {
            client = new SourceClient()
            await handleWithLister(req, res, client.nodes, (page: string) => parseInt(page, 10))
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
