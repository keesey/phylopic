import SourceClient from "@phylopic/source-client"
import { Contributor } from "@phylopic/source-models"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<Contributor | null> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        await verifyAuthorization(req.headers, { sub: uuid })
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new SourceClient()
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                res.json(await client.sourceContributor(uuid).get())
                break;
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PATCH, PUT")
                res.status(204)
                break
            }
            case "PATCH": {
                client = new SourceClient()
                await client.sourceContributor(uuid).patch(req.body)
                res.status(204)
                break;
            }
            case "PUT": {
                client = new SourceClient()
                await client.sourceContributor(uuid).put(req.body)
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
        client?.destroy()
    }
    res.end()
}
export default index
