import SourceClient from "@phylopic/source-client"
import { isJWT } from "@phylopic/source-models"
import { isImageMediaType, isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import verifyJWT from "~/auth/jwt/verifyJWT"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const imageUUID = req.query.uuid
        if (!isUUIDv4(imageUUID)) {
            throw 404
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const token = req.query.token
                const payload = typeof token === "string" ? await verifyJWT(token) : null
                const contributorUUID = payload?.sub
                if (!isUUIDv4(contributorUUID)) {
                    throw 401
                }
                client = new SourceClient()
                const { data, type } = await client.submission(contributorUUID, imageUUID).file.get()
                res.status(200)
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                res.setHeader("content-type", type)
                res.send(data)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PUT")
                res.status(204)
                break
            }
            case "PUT": {
                const { sub: contributorUUID } = await verifyAuthorization(req.headers) ?? {}
                if (!isUUIDv4(contributorUUID)) {
                    throw 401
                }
                if (!req.body) {
                    throw 400
                }
                const type = req.headers["content-type"]
                if (!isImageMediaType(type)) {
                    throw 415
                }
                client = new SourceClient()
                const sourceImage = client.sourceImage(imageUUID)
                if (await sourceImage.exists()) {
                    const image = await sourceImage.get()
                    if (image.contributor !== contributorUUID) {
                        throw 403
                    }
                }
                await client.submission(contributorUUID, imageUUID).file.put({
                    data: req.body,
                    type,
                })
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
