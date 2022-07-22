import { PutObjectCommand, S3Client, ListObjectsV2Command, GetObjectTaggingCommand } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import {
    createSearch,
    EmailAddress,
    isEmailAddress,
    isString,
    isUUID,
    normalizeUUID,
    stringifyNormalized,
    UUID,
} from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import getContributorSubmissionsKeyPrefix from "~/s3/keys/contribute/getContributorSubmissionsKeyPrefix"
import getSubmissionKey from "~/s3/keys/contribute/getSubmissionKey"
import extractUUIDFromSubmissionKey from "~/s3/keys/source/extractUUIDFromSubmissionKey"
const findExistingUUID = async (
    client: S3Client,
    email: EmailAddress,
    ContinuationToken?: string,
): Promise<UUID | undefined> => {
    const output = await client.send(
        new ListObjectsV2Command({
            Bucket: CONTRIBUTE_BUCKET_NAME,
            ContinuationToken,
            Delimiter: "/",
            Prefix: getContributorSubmissionsKeyPrefix(email),
        }),
    )
    if (output.CommonPrefixes?.length) {
        const result = await Promise.all(
            output.CommonPrefixes.map(async cp => {
                const Key = cp.Prefix + "meta.json"
                const tagging = cp.Prefix
                    ? await client.send(
                          new GetObjectTaggingCommand({
                              Bucket: CONTRIBUTE_BUCKET_NAME,
                              Key,
                          }),
                      )
                    : null
                return tagging?.TagSet?.some(tag => tag.Key === "started" && tag.Value === "false")
                    ? extractUUIDFromSubmissionKey(Key)
                    : null
            }),
        )
        const uuid = result.find(isString)
        if (isUUID(uuid)) {
            return uuid
        }
    }
    if (output.NextContinuationToken) {
        return findExistingUUID(client, email, output.NextContinuationToken)
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
            const email = payload?.sub
            console.debug(payload)
            if (!isEmailAddress(email)) {
                throw 401
            }
            const client = new S3Client({})
            let uuid: UUID | undefined
            try {
                uuid = await findExistingUUID(client, email)
                if (!uuid) {
                    uuid = normalizeUUID(randomUUID())
                    await client.send(
                        new PutObjectCommand({
                            Body: stringifyNormalized({}),
                            Bucket: CONTRIBUTE_BUCKET_NAME,
                            ContentType: "application/json",
                            Key: getSubmissionKey(email, uuid),
                            Tagging: "finalized=false&started=false",
                        }),
                    )
                }
            } finally {
                client.destroy()
            }
            res.json({ uuid })
        } else {
            throw 405
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
