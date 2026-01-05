import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { Submission } from "@phylopic/source-models"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Submission, string> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.contributor(uuid).submissions, (page: string) => page)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
