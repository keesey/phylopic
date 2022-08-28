import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/api/handleAPIError"
import handleWithImageFileEditor from "~/api/handleWithImageFileEditor"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithImageFileEditor(req, res, client.image(uuid).file, client.image(uuid))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
