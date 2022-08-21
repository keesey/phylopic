import { Node } from "@phylopic/source-models"
import { UUID, ValidationFault, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import isExternalPost from "~/models/detection/isExternalPost"
import getResolver from "~/resolvers/getResolver"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<(Node & { uuid: UUID }) | ValidationFault[]> = async (req, res) => {
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
                if (!isExternalPost(body)) {
                    res.json(collector.list())
                    res.status(400)
                } else {
                    client = new SourceClient()
                    const externalClient = client.external(body.authority, body.namespace, body.objectID)
                    if (await externalClient.exists()) {
                        const existing = await externalClient.get()
                        const node = await client.node(existing.node).get()
                        res.json(node)
                        res.status(200)
                    } else {
                        const resolve = getResolver(body.authority, body.namespace)
                        if (!resolve) {
                            res.json([
                                {
                                    field: "body.namespace",
                                    message: "Unsupported authorized namespace for new nodes.",
                                } as ValidationFault,
                            ])
                            res.status(400)
                        } else {
                            const node = await resolve(client, body.objectID)
                            res.json(node)
                            res.status(200)
                        }
                    }
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
