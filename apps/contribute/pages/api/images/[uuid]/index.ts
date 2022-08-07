import SourceClient from "@phylopic/source-client"
import { Image } from "@phylopic/source-models"
import { isUUIDv4, stringifyNormalized } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<Image> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        const sourceImage = client.sourceImage(uuid)
        const image = await sourceImage.get()
        await verifyAuthorization(req.headers, { sub: image.contributor })
        switch (req.method) {
            case "DELETE": {
                await sourceImage.delete()
                res.status(204)
                break
            }
            case "GET":
            case "HEAD": {
                res.status(200)
                res.json(image)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS")
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
