import { Image, isSubmittableImage } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Image> = async (req, res) => {
    const now = new Date()
    let client: SourceClient | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        const imageClient = client.image(uuid)
        const image = await imageClient.get()
        await verifyAuthorization(req.headers, { sub: image.contributor })
        switch (req.method) {
            case "DELETE": {
                if (image.submitted) {
                    res.status(409)
                }
                await Promise.all([imageClient.delete(), imageClient.file.delete()])
                res.status(204)
            }
            case "GET":
            case "HEAD": {
                res.status(200)
                res.setHeader("cache-control", "max-age=0, stale-while-revalidate=86400")
                res.json(image)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH")
                res.status(204)
                break
            }
            case "PATCH": {
                if (typeof req.body.accepted === "boolean" && req.body.accepted !== image.accepted) {
                    throw 403
                }
                const combined: Image & { uuid: UUID } = {
                    ...image,
                    ...(req.body as Partial<Image>),
                    contributor: image.contributor,
                    modified: now.toISOString(),
                    uuid,
                }
                if (combined.submitted && !isSubmittableImage(combined)) {
                    throw 409
                }
                await imageClient.put(combined)
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
