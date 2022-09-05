import { handleAPIError, handleWithDeletor, ImageFile } from "@phylopic/source-client"
import { isHash } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<ImageFile> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { hash } = req.query
        if (!isHash(hash)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithDeletor(req, res, client.submission(hash).file)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
