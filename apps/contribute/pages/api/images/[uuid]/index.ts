import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3"
import { Image, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { IMAGE_MEDIA_TYPES, isUUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import checkMetadataBearer from "~/s3/api/checkMetadataBearer"
import sendHeadOrGet from "~/s3/api/sendHeadOrGet"
import getImageFileKey from "~/s3/keys/source/getImageFileKey"
import getImageKey from "~/s3/keys/source/getImageKey"
import getImageFileExtension from "~/utils/getImageFileExtension"
const index: NextApiHandler<string> = async (req, res) => {
    let client: S3Client | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUID(uuid)) {
            throw 404
        }
        switch (req.method) {
            case "DELETE": {
                client = new S3Client({})
                const [image, imageOutput] = await getJSON<Image>(client, {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: getImageKey(uuid),
                })
                checkMetadataBearer(imageOutput)
                await verifyAuthorization(req.headers, { sub: image.contributor })
                await client.send(
                    new DeleteObjectsCommand({
                        Bucket: SOURCE_BUCKET_NAME,
                        Delete: {
                            Objects: [
                                { Key: getImageKey(uuid) },
                                ...Array.from(IMAGE_MEDIA_TYPES).map(type => ({
                                    Key: getImageFileKey(uuid, getImageFileExtension(type)),
                                })),
                            ],
                        },
                    }),
                )
                break
            }
            case "GET":
            case "HEAD": {
                client = new S3Client({})
                const [, imageOutput] = await getJSON<Image>(client, {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `images/${uuid}/meta.json`,
                })
                checkMetadataBearer(imageOutput)
                sendHeadOrGet(req, res, imageOutput)
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
