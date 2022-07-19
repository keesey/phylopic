import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { Image, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isDefined, isString, isUUID, stringifyNormalized, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import checkMetadataBearer from "~/s3/api/checkMetadataBearer"
import getImageKey from "~/s3/keys/source/getImageKey"
const index: NextApiHandler<string> = async (req, res) => {
    let client: S3Client | undefined
    try {
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new S3Client({})
                const payload = await verifyAuthorization(req.headers)
                let { token } = req.query
                let uuids: UUID[]
                do {
                    const listOutput = await client.send(
                        new ListObjectsV2Command({
                            Bucket: SOURCE_BUCKET_NAME,
                            ContinuationToken: isString(token) ? token : undefined,
                            Delimiter: "/",
                            Prefix: "images/",
                        }),
                    )
                    checkMetadataBearer(listOutput)
                    const imagePromises = listOutput.CommonPrefixes?.map(async commonPrefix => {
                        const uuid = commonPrefix.Prefix?.replace(/^images\//, "").replace(/\/$/, "")
                        const [image] = isUUID(uuid)
                            ? await getJSON<Image>(client!, {
                                  Bucket: SOURCE_BUCKET_NAME,
                                  Key: getImageKey(uuid),
                              })
                            : []
                        return image?.contributor === payload?.uuid ? uuid : null
                    })
                    uuids = (await Promise.all(imagePromises ?? [])).filter(isDefined)
                    token = listOutput.NextContinuationToken
                } while (!uuids.length && token)
                const json = stringifyNormalized({
                    nextToken: token,
                    uuids,
                })
                res.setHeader("content-length", json.length)
                res.setHeader("content-type", "application/json")
                if (req.method === "GET") {
                    res.send(json)
                }
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
