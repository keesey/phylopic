import { Page } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { isNormalizedText, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/api/handleAPIError"
import handleWithLister from "~/api/handleWithLister"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Node & { uuid: UUID }, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { text } = req.query
        if (!isNormalizedText(text)) {
            throw 400
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
