import { S3Client } from "@aws-sdk/client-s3"
import { SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isImageMediaType, isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import handleDelete from "~/s3/api/handleDelete"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import handlePut from "~/s3/api/handlePut"
import getSubmissionSourceKey from "~/s3/keys/submissions/getSubmissionSourceKey"
const index: NextApiHandler<string | null> = async (req, res) => {
    let client: S3Client | undefined
    try {
        const payload = await verifyAuthorization(req.headers)
        const contributorUUID = payload?.uuid
        if (!isUUIDv4(contributorUUID)) {
            throw 401
        }
        const imageUUID = req.query.uuid
        if (!isUUIDv4(imageUUID)) {
            throw 404
        }
        switch (req.method) {
            case "DELETE": {
                client = new S3Client({})
                await handleDelete(res, client, {
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    Key: getSubmissionSourceKey(contributorUUID, imageUUID),
                })
                break
            }
            case "GET":
            case "HEAD": {
                client = new S3Client({})
                await handleHeadOrGet(req, res, client, {
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    Key: getSubmissionSourceKey(contributorUUID, imageUUID),
                })
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PUT")
                res.status(204)
                break
            }
            case "PUT": {
                if (!req.body) {
                    throw 400
                }
                const contentType = req.headers["content-type"]
                if (!isImageMediaType(contentType)) {
                    throw 415
                }
                client = new S3Client({})
                await handlePut(res, client, {
                    Body: req.body,
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    ContentType: contentType,
                    Key: getSubmissionSourceKey(contributorUUID, imageUUID),
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
