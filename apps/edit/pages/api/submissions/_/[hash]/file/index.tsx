import { handleAPIError } from "@phylopic/source-client"
import { isHash } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleWithImageFileDeletor from "~/api/handleWithImageFileDeletor"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { hash } = req.query
        if (!isHash(hash)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithImageFileDeletor(req, res, client.submission(hash).file)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
