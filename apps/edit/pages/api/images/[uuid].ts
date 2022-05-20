import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { isImage, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID, normalizeUUID } from "@phylopic/utils"
import { isAWSError, putJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"

const head: NextApiHandler = async (req, res) => {
    const { uuid } = req.query
    if (!isUUID(uuid)) {
        res.status(404).end()
        return
    }
    const command = new HeadObjectCommand({
        Bucket: SOURCE_BUCKET_NAME,
        Key: `images/${normalizeUUID(uuid)}/meta.json`,
    })
    const client = new S3Client({})
    try {
        const result = await client.send(command)
        res.setHeader("Content-Type", result.ContentType ?? "*/*")
        res.setHeader("Content-Length", result.ContentLength ?? "0")
        res.status(200).end()
    } catch (e) {
        const status = (isAWSError(e) && e.$metadata.httpStatusCode) || 404
        res.status(status).end()
    } finally {
        client.destroy()
    }
}
const put: NextApiHandler = async (req, res) => {
    const { uuid } = req.query
    if (!isUUID(uuid)) {
        res.status(400).end()
        return
    }
    if (!isImage(req.body)) {
        res.status(400).end()
        return
    }
    const client = new S3Client({})
    try {
        // :TODO: validate lineage
        await putJSON(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: `images/${normalizeUUID(uuid)}/meta.json`,
            },
            req.body,
        )
    } finally {
        client.destroy()
    }
    res.status(204).end()
}
const images: NextApiHandler<void> = async (req, res) => {
    if (!isUUID(req.query.uuid)) {
        console.error("Missing or invalid UUID.")
        res.status(400).end()
    } else {
        switch (req.method) {
            case "HEAD": {
                await head(req, res)
                break
            }
            case "PUT": {
                await put(req, res)
                break
            }
            default: {
                res.status(405).end()
            }
        }
    }
}
export default images
