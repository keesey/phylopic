import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3"
import { Image, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { IMAGE_MEDIA_TYPES, isUUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import checkMetadataBearer from "~/s3/api/checkMetadataBearer"
import sendHeadOrGet from "~/s3/api/sendHeadOrGet"
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
                const payload = await verifyAuthorization(req.headers)
                client = new S3Client({})
                const [image, imageOutput] = await getJSON<Image>(client, {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: getImageKey(uuid),
                })
                checkMetadataBearer(imageOutput)
                if (image.contributor !== payload?.uuid) {
                    throw 403
                }
                await client.send(
                    new DeleteObjectsCommand({
                        Bucket: SOURCE_BUCKET_NAME,
                        Delete: {
                            Objects: [
                                {
                                    Key: getImageKey(uuid),
                                },
                                ...Array.from(IMAGE_MEDIA_TYPES).map(type => ({
                                    Key: `images/${uuid}/source.${getImageFileExtension(type)}`,
                                })),
                            ],
                        },
                    }),
                )
                break
            }
            case "GET":
            case "HEAD": {
                const payload = await verifyAuthorization(req.headers)
                client = new S3Client({})
                const [image, imageOutput] = await getJSON<Image>(client, {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `images/${uuid}/meta.json`,
                })
                checkMetadataBearer(imageOutput)
                if (image.contributor !== payload?.uuid) {
                    throw 403
                }
                sendHeadOrGet(req, res, imageOutput)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS")
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
