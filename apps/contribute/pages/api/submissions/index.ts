import { ListObjectsV2Command, ListObjectsV2CommandInput, S3Client } from "@aws-sdk/client-s3"
import { SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isDefined, isNonemptyString, isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import checkMetadataBearer from "~/s3/api/checkMetadataBearer"
import extractUUIDFromSubmissionKey from "~/s3/keys/submissions/extractUUIDFromSubmissionKey"
import getSubmissionsPrefix from "~/s3/keys/submissions/getSubmissionsPrefix"
import { UUIDList } from "~/s3/models/UUIDList"
const handleHeadOrGet = async (
    req: NextApiRequest,
    res: NextApiResponse<UUIDList>,
    input: ListObjectsV2CommandInput,
    extractUUIDFromKey: (key: string) => UUID | null,
) => {
    const client = new S3Client({})
    try {
        const output = await client.send(new ListObjectsV2Command(input))
        checkMetadataBearer(output)
        const submissions: UUIDList = {
            nextToken: output.NextContinuationToken || undefined,
            uuids:
                output.Contents?.map(content => content.Key)
                    .filter(isNonemptyString)
                    .map(extractUUIDFromKey)
                    .filter(isDefined) ?? [],
        }
        res.setHeader("cache-control", "max-age=180, stale-while-revalidate=86400")
        if (req.method === "HEAD") {
            res.setHeader("content-length", JSON.stringify(submissions).length)
            res.setHeader("content-type", "application/json")
        } else {
            res.json(submissions)
        }
    } finally {
        client.destroy()
    }
}
const index: NextApiHandler<UUIDList | null> = async (req, res) => {
    try {
        const payload = await verifyAuthorization(req.headers)
        const contributorUUID = payload?.sub
        if (!isUUIDv4(contributorUUID)) {
            throw 401
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                await handleHeadOrGet(
                    req,
                    res,
                    {
                        Bucket: SUBMISSIONS_BUCKET_NAME,
                        ContinuationToken: typeof req.query.token === "string" ? req.query.token : undefined,
                        Delimiter: "/",
                        Prefix: getSubmissionsPrefix(contributorUUID),
                    },
                    extractUUIDFromSubmissionKey,
                )
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS")
                res.status(204)
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
