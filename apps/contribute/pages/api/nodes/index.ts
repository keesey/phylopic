import { Page } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { normalizeUUID, UUID, ValidationFault, ValidationFaultCollector } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import isNodePost from "~/models/detection/isNodePost"
import getNodeFilter from "~/pagination/getNodeFilter"
import getPageIndex from "~/pagination/getPageIndex"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Node, number> | (Node & { uuid: UUID }) | ValidationFault[]> = async (req, res) => {
    const now = new Date()
    let client: SourceClient | undefined
    try {
        await verifyAuthorization(req.headers)
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const filter = getNodeFilter(req.query)
                const pageIndex = getPageIndex(req.query)
                client = new SourceClient()
                const page = await (filter ? client.nodes.search(filter).page(pageIndex) : client.nodes.page(pageIndex))
                res.status(200)
                res.json(page)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, POST")
                res.status(204)
                break
            }
            case "POST": {
                const collector = new ValidationFaultCollector(["body"])
                const { body } = req
                if (!isNodePost(body)) {
                    res.json(collector.list())
                    res.status(400)
                } else {
                    client = new SourceClient()
                    const node: Node & { uuid: UUID } = {
                        created: now.toISOString(),
                        modified: now.toISOString(),
                        names: [body.name],
                        parent: body.parent,
                        uuid: normalizeUUID(randomUUID()),
                    }
                    await client?.node(node.uuid).put(node)
                    res.status(200)
                    res.json(node)
                }
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
