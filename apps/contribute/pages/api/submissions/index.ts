import SourceClient from "@phylopic/source-client"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import { UUIDList } from "~/s3/models/UUIDList"
const index: NextApiHandler<UUIDList | null> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const payload = await verifyAuthorization(req.headers)
        const contributorUUID = payload?.sub
        if (!isUUIDv4(contributorUUID)) {
            throw 401
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                let token = typeof req.query.token === "string" ? req.query.token : undefined
                client = new SourceClient()
                const list = await client.submissions(contributorUUID, token)
                res.status(200)
                res.json({
                    uuids: list.items,
                    ...(list.nextToken ? { nextToken: list.nextToken } : null),
                })
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
        client?.destroy()
    }
    res.end()
}
export default index
