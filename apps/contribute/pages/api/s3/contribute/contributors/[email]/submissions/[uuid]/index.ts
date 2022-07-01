import { S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { isEmailAddress, isUUID, stringifyNormalized, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleDelete from "~/s3/api/handleDelete"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import handlePatch from "~/s3/api/handlePatch"
import handlePut from "~/s3/api/handlePut"
import getSubmissionKey from "~/s3/keys/getSubmissionKey"
import { isPartialSubmission } from "~/submission/isPartialSubmission"
const parseJSON = (json: string): unknown => {
    try {
        return JSON.parse(json)
    } catch (e) {
        console.error(e)
        throw 400
    }
}
const index: NextApiHandler<string | null> = async (req, res) => {
    try {
        const { email, uuid } = req.query
        if (!isEmailAddress(email) || !isUUID(uuid)) {
            throw 404
        }
        verifyAuthorization(req.headers, email)
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const client = new S3Client({})
                try {
                    await handleHeadOrGet(req, res, client, {
                        Bucket: CONTRIBUTE_BUCKET_NAME,
                        Key: getSubmissionKey(email, uuid),
                    })
                } finally {
                    client.destroy()
                }
                break
            }
            case "DELETE": {
                const client = new S3Client({})
                try {
                    await handleDelete(res, client, {
                        Bucket: CONTRIBUTE_BUCKET_NAME,
                        Key: getSubmissionKey(email, uuid),
                    })
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
            case "PATCH": {
                const client = new S3Client({})
                try {
                    await handlePatch(
                        req,
                        res,
                        client,
                        {
                            Bucket: CONTRIBUTE_BUCKET_NAME,
                            Key: getSubmissionKey(email, uuid),
                        },
                        isPartialSubmission,
                    )
                } finally {
                    client.destroy()
                }
                break
            }
            case "PUT": {
                const submission = parseJSON(req.body)
                const faultCollector = new ValidationFaultCollector()
                if (!isPartialSubmission(submission, faultCollector)) {
                    console.error(faultCollector.list())
                    throw 400
                }
                const client = new S3Client({})
                try {
                    await handlePut(res, client, {
                        Body: stringifyNormalized(submission),
                        Bucket: CONTRIBUTE_BUCKET_NAME,
                        ContentType: "application/json",
                        Key: getSubmissionKey(email, uuid),
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
