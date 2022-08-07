import SourceClient from "@phylopic/source-client"
import { Submission } from "@phylopic/source-models"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<Submission> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const payload = await verifyAuthorization(req.headers)
        const contributorUUID = payload?.sub
        if (!isUUIDv4(contributorUUID)) {
            throw 401
        }
        const imageUUID = req.query.uuid
        if (!isUUIDv4(imageUUID)) {
            throw 404
        }
        switch (req.method) {
            case "DELETE": {
                client = new SourceClient()
                client.submission(contributorUUID, imageUUID).delete()
                break
            }
            case "GET":
            case "HEAD": {
                client = new SourceClient()
                const submission = await client.submission(contributorUUID, imageUUID).get()
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                res.json(submission)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH, PUT")
                res.status(204)
                break
            }
            case "PATCH": {
                client = new SourceClient()
                await client.submission(contributorUUID, imageUUID).patch(req.body)
                res.status(204)
                break
            }
            case "PUT": {
                client = new SourceClient()
                await client.submission(contributorUUID, imageUUID).put(req.body)
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
