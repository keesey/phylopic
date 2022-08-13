import { isJWT } from "@phylopic/source-models"
import { isImageMediaType, isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyJWT from "~/auth/jwt/verifyJWT"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid, token } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        if (!isJWT(token)) {
            throw 401
        }
        const { sub: contributorUUID } = (await verifyJWT(token)) ?? {}
        if (!isUUIDv4(contributorUUID)) {
            throw 403
        }
        client = new SourceClient()
        const imageClient = client.image(uuid)
        const image = await imageClient.get()
        if (image.contributor !== contributorUUID) {
            throw 403
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const { data, type } = await imageClient.file.get()
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
                const type = req.headers["content-type"]
                if (!isImageMediaType(type)) {
                    throw 415
                }
                await Promise.all([
                    imageClient.file.put({
                        data: req.body,
                        type,
                    }),
                    imageClient.patch({ modified: new Date().toISOString() }),
                ])
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
