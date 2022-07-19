import { ListObjectsV2Command, ListObjectsV2CommandInput, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { isDefined, isEmailAddress, isNonemptyString, UUID } from "@phylopic/utils"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import getContributorSubmissionsKeyPrefix from "~/s3/keys/contribute/getContributorSubmissionsKeyPrefix"
import extractUUIDFromSubmissionKey from "~/s3/keys/source/extractUUIDFromSubmissionKey"
import { UUIDList } from "~/s3/models/UUIDList"
const handleHeadOrGet = async (
    req: NextApiRequest,
    res: NextApiResponse<UUIDList>,
    input: ListObjectsV2CommandInput,
    extractUUIDFromKey: (key: string) => UUID | null,
) => {
    const client = new S3Client({})
    try {
        const response = await client.send(new ListObjectsV2Command(input))
        if (typeof response.$metadata.httpStatusCode === "number" && response.$metadata.httpStatusCode >= 400) {
            throw response.$metadata.httpStatusCode
        }
        const submissions: UUIDList = {
            nextToken: response.NextContinuationToken || undefined,
            uuids:
                response.Contents?.map(content => content.Key)
                    .filter(isNonemptyString)
                    .map(extractUUIDFromKey)
                    .filter(isDefined) ?? [],
        }
        res.setHeader("cache-control", "max-age=180, stale-while-revalidate=86400")
        if (req.method === "GET") {
            res.json(submissions)
        }
    } finally {
        client.destroy()
    }
}
const index: NextApiHandler<UUIDList | null> = async (req, res) => {
    try {
        const email = req.query.email
        if (!isEmailAddress(email)) {
            throw 404
        }
        verifyAuthorization(req.headers, email)
        switch (req.method) {
            case "GET":
            case "HEAD": {
                await handleHeadOrGet(
                    req,
                    res,
                    {
                        Bucket: CONTRIBUTE_BUCKET_NAME,
                        ContinuationToken: typeof req.query.token === "string" ? req.query.token : undefined,
                        Prefix: getContributorSubmissionsKeyPrefix(email),
                    },
                    extractUUIDFromSubmissionKey,
                )
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
    }
    res.end()
}
export default index
