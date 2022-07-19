import { S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import findImageFileExtension from "~/s3/keys/source/findImageFileExtension"
import getImageFileKey from "~/s3/keys/source/getImageFileKey"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: S3Client | undefined
    try {
        const { uuid } = req.query
        if (!isUUID(uuid)) {
            throw 404
        }
        client = new S3Client({
            maxAttempts: 100,
        })
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new S3Client({})
                const extension = await findImageFileExtension(client, uuid)
                if (!extension) {
                    throw 404
                }
                await handleHeadOrGet(req, res, client, {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: getImageFileKey(uuid, extension),
                })
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS")
                res.setHeader("cache-control", "max-age=3600")
                res.setHeader("date", new Date().toUTCString())
                res.status(204)
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        if (typeof e === "number") {
            res.status(e)
        } else {
            console.error(e)
            res.status(500)
        }
    } finally {
        client?.destroy()
    }
    res.end()
}
export default index
