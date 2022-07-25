import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isObject, isString, isUUID, normalizeUUID, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import extractUUIDFromSubmissionKey from "~/s3/keys/submissions/extractUUIDFromSubmissionKey"
import getSubmissionKey from "~/s3/keys/submissions/getSubmissionKey"
import getSubmissionsPrefix from "~/s3/keys/submissions/getSubmissionsPrefix"
import { Submission } from "~/submission/Submission"
const isEmptySubmission = (x: unknown): x is {} => isObject(x) && Object.keys(x).length === 0
const findEmptySubmission = async (
    client: S3Client,
    contributorUUID: UUID,
    ContinuationToken?: string,
): Promise<UUID | undefined> => {
    const output = await client.send(
        new ListObjectsV2Command({
            Bucket: SUBMISSIONS_BUCKET_NAME,
            ContinuationToken,
            Delimiter: "/",
            Prefix: getSubmissionsPrefix(contributorUUID),
        }),
    )
    if (output.CommonPrefixes?.length) {
        const result = await Promise.all(
            output.CommonPrefixes.map(async commonPrefix => {
                const Key = commonPrefix.Prefix + "meta.json"
                const [submission] = await getJSON<Partial<Submission>>(client, {
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    Key,
                })
                if (isEmptySubmission(submission)) {
                    return extractUUIDFromSubmissionKey(Key)
                }
                return null
            }),
        )
        const uuid = result.find(isString)
        if (isUUID(uuid)) {
            return uuid
        }
    }
    if (output.NextContinuationToken) {
        return findEmptySubmission(client, contributorUUID, output.NextContinuationToken)
    }
}
const index: NextApiHandler<{ uuid: UUID }> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method === "POST") {
            const payload = await verifyAuthorization(req.headers)
            const contributorUUID = payload.uuid
            if (!isUUID(contributorUUID)) {
                throw 401
            }
            const client = new S3Client({})
            let imageUUID: UUID | undefined
            try {
                imageUUID = await findEmptySubmission(client, contributorUUID)
                if (!imageUUID) {
                    imageUUID = normalizeUUID(randomUUID())
                    await client.send(
                        new PutObjectCommand({
                            Body: "{}",
                            Bucket: SUBMISSIONS_BUCKET_NAME,
                            ContentType: "application/json",
                            Key: getSubmissionKey(contributorUUID, imageUUID),
                        }),
                    )
                }
            } finally {
                client.destroy()
            }
            res.json({ uuid: imageUUID })
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
