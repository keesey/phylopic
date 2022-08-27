import { Node } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/api/handleAPIError"
import handleWithPatcher from "~/api/handleWithPatcher"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Node & { uuid: UUID }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithPatcher(req, res, client.node(uuid))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
