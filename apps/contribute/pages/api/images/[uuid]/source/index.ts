import { Image } from "@phylopic/source-models"
import { isImageMediaType, isUUIDv4, UUID } from "@phylopic/utils"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Buffer> = async (req, res) => {
    const now = new Date()
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        const imageClient = client.image(uuid)
        let image: Image | null = null
        let contributorUUID: UUID
        if (await imageClient.exists()) {
            image = await imageClient.get()
            await verifyAuthorization(req.headers, { sub: image.contributor })
            contributorUUID = image.contributor
        } else {
            const { sub } = (await verifyAuthorization(req.headers)) ?? {}
            if (!isUUIDv4(sub)) {
                throw 403
            }
            contributorUUID = sub
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                if (!image) {
                    throw 404
                }
                const { data, type } = await imageClient.file.get()
                res.status(200)
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
                const filePromise = imageClient.file.put({
                    data: await convertS3BodyToBuffer(req.body),
                    type,
                })
                const imagePromise = image
                    ? imageClient.patch({ modified: now.toISOString() })
                    : imageClient.put({
                          accepted: false,
                          attribution: null,
                          contributor: contributorUUID,
                          created: now.toISOString(),
                          general: null,
                          license: null,
                          modified: now.toISOString(),
                          specific: null,
                          sponsor: null,
                          submitted: false,
                          uuid,
                      })
                await Promise.all([filePromise, imagePromise])
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
