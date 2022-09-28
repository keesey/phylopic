import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { External } from "@phylopic/source-models"
import { Authority, isUUIDv4, Namespace, ObjectID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<
    Page<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number> | number
> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.node(uuid).externals, (page: string) => parseInt(page, 10))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
