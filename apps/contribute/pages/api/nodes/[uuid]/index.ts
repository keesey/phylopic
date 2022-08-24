import { Node } from "@phylopic/source-models"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Node> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new SourceClient()
                const node = await client.node(uuid).get()
                res.status(200)
                res.json(node)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS")
                res.status(204)
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
