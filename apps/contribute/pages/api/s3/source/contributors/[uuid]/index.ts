import { GetObjectTaggingCommand, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME, Contributor, isContributor, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress, isObject, isUUID, stringifyNormalized, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handlePut from "~/s3/api/handlePut"
import sendHeadOrGet from "~/s3/api/sendHeadOrGet"
import getContributorMetaKey from "~/s3/keys/getContributorMetaKey"
import getContributorSourceKey from "~/s3/keys/getContributorSourceKey"
const parseJSON = (json: string): unknown => {
    try {
        return JSON.parse(json)
    } catch (e) {
        console.error(e)
        throw 400
    }
}
const getContributorJSON = async (client: S3Client, uuid: UUID) =>
    getJSON(
        client,
        {
            Bucket: SOURCE_BUCKET_NAME,
            Key: getContributorSourceKey(uuid),
        },
        isContributor,
    )
const getVerified = async (client: S3Client, email: EmailAddress) => {
    const response = await client.send(
        new GetObjectTaggingCommand({
            Bucket: CONTRIBUTE_BUCKET_NAME,
            Key: getContributorMetaKey(email),
        }),
    )
    return response.TagSet?.find(value => value.Key === "verified")?.Value === "true"
}
const index: NextApiHandler<string | null> = async (req, res) => {
    try {
        const { uuid } = req.query
        if (!isUUID(uuid)) {
            throw 404
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const client = new S3Client({})
                try {
                    const [contributor, output] = await getContributorJSON(client, uuid)
                    if (!contributor.emailAddress) {
                        throw 403
                    }
                    verifyAuthorization(req.headers, contributor.emailAddress)
                    sendHeadOrGet(req, res, output)
                } finally {
                    client.destroy()
                }
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PATCH, PUT")
                res.setHeader("cache-control", "max-age=3600")
                res.setHeader("date", new Date().toUTCString())
                res.status(204)
                break
            }
            case "PATCH":
            case "PUT": {
                let contributor: Contributor
                const payload = parseJSON(req.body)
                const faultCollector = new ValidationFaultCollector()
                if (req.method === "PUT") {
                    if (!isContributor(payload, faultCollector)) {
                        console.error(faultCollector.list())
                        throw 400
                    }
                    contributor = payload
                } else if (!isObject(payload)) {
                    throw 400
                }
                const client = new S3Client({})
                try {
                    const [existing] = await getJSON(
                        client,
                        {
                            Bucket: SOURCE_BUCKET_NAME,
                            Key: getContributorSourceKey(uuid),
                        },
                        isContributor,
                    )
                    if (req.method !== "PUT") {
                        contributor = {
                            ...existing,
                            ...payload,
                        }
                        if (!isContributor(contributor, faultCollector)) {
                            console.error(faultCollector.list())
                            throw 400
                        }
                    }
                    if (
                        existing &&
                        (contributor!.emailAddress !== existing.emailAddress ||
                            contributor!.created !== existing.created)
                    ) {
                        throw 400
                    }
                    await handlePut(res, client, {
                        Body: stringifyNormalized(contributor!),
                        Bucket: CONTRIBUTE_BUCKET_NAME,
                        ContentType: "application/json",
                        Key: getContributorSourceKey(uuid),
                    })
                } finally {
                    client.destroy()
                }
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
    }
    res.end()
}
export default index
