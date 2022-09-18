import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Node & { uuid: UUID }, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const text = req.query.q
        if (typeof text !== "string" || text.length < 0) {
            throw 404
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.nodes.search(text))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
