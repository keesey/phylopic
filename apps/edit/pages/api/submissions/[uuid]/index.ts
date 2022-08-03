import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { SUBMISSIONS_BUCKET_NAME, isContribution } from "@phylopic/source-models"
import { isUUID, normalizeUUID } from "@phylopic/utils"
import { isAWSError, putJSON } from "@phylopic/utils-aws"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const deleteSubmission = async (client: S3Client, req: NextApiRequest, res: NextApiResponse<void>) => {
    const { contributor, uuid } = req.query
    if (!isUUID(uuid) || typeof contributor !== "string") {
        res.status(404).end()
        return
    }
    try {
        await client.send(
            new CopyObjectCommand({
                Bucket: SUBMISSIONS_BUCKET_NAME,
                CopySource: SUBMISSIONS_BUCKET_NAME + `/contributions/${normalizeUUID(uuid)}/meta.json`,
                Key: `trash/contributions/${normalizeUUID(uuid)}/meta.json`,
            }),
        )
        await client.send(
            new DeleteObjectCommand({
                Bucket: SUBMISSIONS_BUCKET_NAME,
                Key: `contributions/${normalizeUUID(uuid)}/meta.json`,
            }),
        )
    } catch (e) {
        const status = isAWSError(e) ? e.$metadata.httpStatusCode : 404
        res.status(status).end()
        return
    }
    res.status(204).end()
}
const head = async (client: S3Client, req: NextApiRequest, res: NextApiResponse<void>) => {
    const { contributor, uuid } = req.query
    if (!isUUID(uuid) || typeof contributor !== "string") {
        res.status(404).end()
        return
    }
    const command = new HeadObjectCommand({
        Bucket: SUBMISSIONS_BUCKET_NAME,
        Key: `contributions/${normalizeUUID(uuid)}/meta.json`,
    })
    try {
        const result = await client.send(command)
        res.setHeader("Content-Type", result.ContentType ?? "*/*")
        res.setHeader("Content-Length", result.ContentLength ?? "0")
    } catch (e) {
        res.status(isAWSError(e) ? e.$metadata.httpStatusCode : 404).end()
        return
    }
    res.status(200).end()
}
const put = async (client: S3Client, req: NextApiRequest, res: NextApiResponse<void>) => {
    const { contributor, uuid } = req.query
    if (!isUUID(uuid) || typeof contributor !== "string") {
        res.status(404).end()
        return
    }
    if (!isContribution(req.body)) {
        res.status(400).end()
        return
    }
    await putJSON(
        client,
        {
            Bucket: SUBMISSIONS_BUCKET_NAME,
            Key: `contributions/${normalizeUUID(uuid)}/meta.json`,
        },
        req.body,
    )
    res.status(204).end()
}
const submissions: NextApiHandler<void> = async (req, res) => {
    if (!isUUID(req.query.uuid)) {
        console.error("Missing or invalid UUID.")
        res.status(404).end()
    } else {
        const client = new S3Client({})
        try {
            switch (req.method) {
                case "DELETE": {
                    await deleteSubmission(client, req, res)
                    break
                }
                case "HEAD": {
                    await head(client, req, res)
                    break
                }
                case "PUT": {
                    await put(client, req, res)
                    break
                }
                default: {
                    res.status(405).end()
                }
            }
        } finally {
            client.destroy()
        }
    }
}
export default submissions
