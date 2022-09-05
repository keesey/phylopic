import { handleAPIError, handleWithPatcher } from "@phylopic/source-client"
import { Submission } from "@phylopic/source-models"
import { isHash, isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Submission> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { hash } = req.query
        if (!isHash(hash)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithPatcher(req, res, client.submission(hash))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
