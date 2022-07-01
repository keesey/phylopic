import { DeleteObjectCommand, GetObjectTaggingCommand, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { createSearch, isEmailAddress, isImageMediaType, isUUID, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import getBearerJWT from "~/auth/http/getBearerJWT"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import decodeJWT from "~/auth/jwt/decodeJWT"
import handleDelete from "~/s3/api/handleDelete"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import handlePut from "~/s3/api/handlePut"
import { ImageFileExtension } from "~/s3/ImageFileExtension"
import findSubmissionFileExtension from "~/s3/keys/findSubmissionFileExtension"
import getSubmissionFileKey from "~/s3/keys/getSubmissionFileKey"
import getImageFileExtension from "~/utils/getImageFileExtension"
const getEmail = async (client: S3Client, uuid: UUID, extension: ImageFileExtension) => {
    const response = await client.send(
        new GetObjectTaggingCommand({
            Bucket: CONTRIBUTE_BUCKET_NAME,
            Key: getSubmissionFileKey(uuid, extension),
        }),
    )
    const email = response.TagSet?.find(tag => tag.Key === "email")?.Value
    if (!isEmailAddress(email)) {
        throw 403
    }
    return email
}
const index: NextApiHandler<string | null> = async (req, res) => {
    let client: S3Client | undefined
    try {
        const { uuid } = req.query
        if (!isUUID(uuid)) {
            throw 404
        }
        client = new S3Client({})
        const extension = await findSubmissionFileExtension(client, uuid)
        const taggedEmail = extension ? await getEmail(client, uuid, extension) : undefined
        switch (req.method) {
            case "DELETE": {
                if (!extension || !taggedEmail) {
                    throw 404
                }
                verifyAuthorization(req.headers, taggedEmail)
                await handleDelete(res, client, {
                    Bucket: CONTRIBUTE_BUCKET_NAME,
                    Key: getSubmissionFileKey(uuid, extension),
                })
                break
            }
            case "GET":
            case "HEAD": {
                if (!extension || !taggedEmail) {
                    throw 404
                }
                verifyAuthorization(req.headers, taggedEmail)
                await handleHeadOrGet(req, res, client, {
                    Bucket: CONTRIBUTE_BUCKET_NAME,
                    Key: getSubmissionFileKey(uuid, extension),
                })
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PUT")
                res.setHeader("cache-control", "max-age=3600")
                res.setHeader("date", new Date().toUTCString())
                res.status(204)
                break
            }
            case "PUT": {
                let authEmail: string | undefined
                if (taggedEmail) {
                    verifyAuthorization(req.headers, taggedEmail)
                } else {
                    authEmail = decodeJWT(getBearerJWT(req.headers.authorization))?.sub
                    if (!isEmailAddress(authEmail)) {
                        throw 401
                    }
                }
                if (!req.body) {
                    throw 400
                }
                const contentType = req.headers["content-type"]
                if (!isImageMediaType(contentType)) {
                    throw 415
                }
                const newExtension = getImageFileExtension(contentType)
                if (extension && extension !== newExtension) {
                    const response = await client.send(
                        new DeleteObjectCommand({
                            Bucket: CONTRIBUTE_BUCKET_NAME,
                            Key: getSubmissionFileKey(uuid, extension),
                        }),
                    )
                    if (
                        typeof response.$metadata.httpStatusCode === "number" &&
                        response.$metadata.httpStatusCode >= 400
                    ) {
                        throw response.$metadata.httpStatusCode
                    }
                }
                await handlePut(res, client, {
                    Body: req.body,
                    Bucket: CONTRIBUTE_BUCKET_NAME,
                    ContentType: contentType,
                    Key: getSubmissionFileKey(uuid, newExtension),
                    Tagging: createSearch({ email: authEmail || taggedEmail }),
                })
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
