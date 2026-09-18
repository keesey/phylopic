import { handleAPIError, handleWithLister, type Page } from "@phylopic/source-client"
import type { Node } from "@phylopic/source-models"
import { isUUIDv4, type UUID } from "@phylopic/utils"
import type { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"

const index: NextApiHandler<Page<Node & { uuid: UUID }, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.node(uuid).children, (page: string) => parseInt(page, 10))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}

export default index
