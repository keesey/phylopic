import { Node } from "@phylopic/source-models"
import { Identifier, UUID, ValidationFault, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import isResolveExternalsPost from "~/models/detection/isResolveExternalsPost"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Record<Identifier, Node & { uuid: UUID }> | ValidationFault[]> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        await verifyAuthorization(req.headers)
        switch (req.method) {
            case "OPTIONS": {
                res.setHeader("allow", "OPTIONS, POST")
                res.status(204)
                break
            }
            case "POST": {
                const collector = new ValidationFaultCollector(["body"])
                const { body } = req
                if (!isResolveExternalsPost(body)) {
                    res.json(collector.list())
                    res.status(400)
                } else {
                    client = new SourceClient()
                    const result = await client.nodes.resolve(body)
                    res.json(result)
                    res.status(200)
                }
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
