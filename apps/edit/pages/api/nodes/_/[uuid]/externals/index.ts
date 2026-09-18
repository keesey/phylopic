import { handleAPIError, handleWithLister, type Page } from "@phylopic/source-client"
import type { External } from "@phylopic/source-models"
import { type Authority, isUUIDv4, type Namespace, type ObjectID } from "@phylopic/utils"
import type { NextApiHandler } from "next"
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
