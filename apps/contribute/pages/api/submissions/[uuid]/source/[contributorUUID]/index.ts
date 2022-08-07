import SourceClient from "@phylopic/source-client"
import { isImageMediaType, isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<string | null> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const imageUUID = req.query.uuid
        const contributorUUID = req.query.contributorUUID
        if (!isUUIDv4(imageUUID) || !isUUIDv4(contributorUUID)) {
            throw 404
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new SourceClient()
                const { data, type } = await client.submission(contributorUUID, imageUUID).file.get()
                res.status(200)
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                res.setHeader("content-type", type)
                res.send(data as any)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PUT")
                res.status(204)
                break
            }
            case "PUT": {
                await verifyAuthorization(req.headers, { sub: contributorUUID })
                if (!req.body) {
                    throw 400
                }
                const type = req.headers["content-type"]
                if (!isImageMediaType(type)) {
                    throw 415
                }
                client = new SourceClient()
                await client.submission(contributorUUID, imageUUID).file.put({
                    data: req.body,
                    type,
                })
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
