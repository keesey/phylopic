import { S3Client } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/errors/handleAPIError"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import findImageFileExtension from "~/s3/keys/source/findImageFileExtension"
import getImageFileKey from "~/s3/keys/source/getImageFileKey"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: S3Client | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
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
                res.setHeader("cache-control", "max-age=180, stale-while-revalidate=86400")
                await handleHeadOrGet(req, res, client, {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: getImageFileKey(uuid, extension),
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
