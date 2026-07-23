import { handleAPIError } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { Identifier } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Record<Identifier, Node & { uuid: string }>> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        client = new SourceClient()
        switch (req.method) {
            case "OPTIONS": {
                res.setHeader("allow", "OPTIONS, POST")
                res.status(204)
                break
            }
            case "POST": {
                res.json(await client.nodes.resolve(req.body))
                res.status(200)
                break
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
