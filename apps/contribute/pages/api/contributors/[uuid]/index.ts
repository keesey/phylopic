import { S3Client } from "@aws-sdk/client-s3"
import { Contributor, isContributor, SOURCE_BUCKET_NAME, SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isObject, isUUID, stringifyNormalized, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import handlePut from "~/s3/api/handlePut"
import getContributorSourceKey from "~/s3/keys/source/getContributorSourceKey"
const parseJSON = (json: string): unknown => {
    try {
        return JSON.parse(json)
    } catch (e) {
        console.error(e)
        throw 400
    }
}
const getContributorJSON = async (client: S3Client, uuid: UUID) =>
    getJSON<Contributor>(client, {
        Bucket: SOURCE_BUCKET_NAME,
        Key: getContributorSourceKey(uuid),
    })
const index: NextApiHandler<Contributor | null> = async (req, res) => {
    try {
        const { uuid } = req.query
        if (!isUUID(uuid)) {
            throw 404
        }
        verifyAuthorization(req.headers, { sub: uuid })
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const client = new S3Client({})
                try {
                    const [contributor] = await getContributorJSON(client, uuid)
                    res.setHeader("cache-control", "max-age=180, stale-while-revalidate=86400")
                    res.json(contributor)
                } finally {
                    client.destroy()
                }
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PATCH, PUT")
                res.status(204)
                break
            }
            case "PATCH":
            case "PUT": {
                let contributor = req.body
                let client: S3Client | null = null
                try {
                    if (req.method === "PATCH") {
                        client = new S3Client({})
                        const [existing] = await getJSON(
                            client,
                            {
                                Bucket: SOURCE_BUCKET_NAME,
                                Key: getContributorSourceKey(uuid),
                            },
                            isContributor,
                        )
                        contributor = {
                            created: existing.created,
                            emailAddress: (contributor as Partial<Contributor>).emailAddress ?? existing.emailAddress,
                            name: (contributor as Partial<Contributor>).name ?? existing.name,
                            showEmailAddress:
                                (contributor as Partial<Contributor>).showEmailAddress ?? existing.showEmailAddress,
                        }
                    }
                    const faultCollector = new ValidationFaultCollector()
                    if (!isContributor(contributor, faultCollector.sub("body"))) {
                        console.error(faultCollector.list())
                        throw 400
                    }
                    client = client ?? new S3Client({})
                    await handlePut(res, client, {
                        Body: stringifyNormalized(contributor),
                        Bucket: SOURCE_BUCKET_NAME,
                        ContentType: "application/json",
                        Key: getContributorSourceKey(uuid),
                    })
                } finally {
                    client?.destroy()
                }
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
