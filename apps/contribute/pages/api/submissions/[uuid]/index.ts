import { S3Client } from "@aws-sdk/client-s3"
import { SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isUUIDv4, stringifyNormalized, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import handleDelete from "~/s3/api/handleDelete"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import handlePatch from "~/s3/api/handlePatch"
import handlePut from "~/s3/api/handlePut"
import getSubmissionKey from "~/s3/keys/submissions/getSubmissionKey"
import { isPartialSubmission } from "~/submission/isPartialSubmission"
import { Submission } from "~/submission/Submission"
const parseSubmission = (json: string): Partial<Submission> => {
    try {
        const submission = JSON.parse(json)
        const faultCollector = new ValidationFaultCollector()
        if (!isPartialSubmission(submission, faultCollector)) {
            console.error(faultCollector.list())
            throw 400
        }
        return submission
    } catch (e) {
        console.error(e)
        throw 400
    }
}
const index: NextApiHandler<string | null> = async (req, res) => {
    let client: S3Client | undefined
    try {
        const payload = await verifyAuthorization(req.headers)
        const contributorUUID = payload.uuid
        const imageUUID = req.query.uuid
        if (!isUUIDv4(imageUUID)) {
            throw 404
        }
        switch (req.method) {
            case "DELETE": {
                client = new S3Client({})
                await handleDelete(res, client, {
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    Key: getSubmissionKey(contributorUUID, imageUUID),
                })
                break
            }
            case "GET":
            case "HEAD": {
                client = new S3Client({})
                await handleHeadOrGet(req, res, client, {
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    Key: getSubmissionKey(contributorUUID, imageUUID),
                })
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH, PUT")
                res.status(204)
                break
            }
            case "PATCH": {
                client = new S3Client({})
                await handlePatch(
                    req,
                    res,
                    client,
                    {
                        Bucket: SUBMISSIONS_BUCKET_NAME,
                        Key: getSubmissionKey(contributorUUID, imageUUID),
                    },
                    isPartialSubmission,
                )
                break
            }
            case "PUT": {
                const submission = parseSubmission(req.body)
                client = new S3Client({})
                await handlePut(res, client, {
                    Body: stringifyNormalized(submission),
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    ContentType: "application/json",
                    Key: getSubmissionKey(contributorUUID, imageUUID),
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
