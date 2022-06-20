import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import { EmailAddress, isUUIDv4, normalizeUUID, UUID } from "@phylopic/utils"
import { streamToString } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import { Readable } from "stream"
import getBearerJWT from "~/auth/http/getBearerJWT"
import includesETag from "~/auth/http/includesETag"
import verifyJWT from "~/auth/jwt/verifyJWT"
import getContributionSourceKey from "~/s3/getContributionSourceKey"
import { ImageFileExtension } from "~/s3/ImageFileExtension"
const getImageSourceKey = async (client: S3Client, email: EmailAddress, uuid: UUID) => {
    const listResponse = await client.send(
        new ListObjectsV2Command({
            Bucket: "contribute.phylopic.org",
            MaxKeys: 1,
            Prefix: `contributions/${encodeURIComponent(normalizeUUID(uuid))}/source.`,
        }),
    )
    if (listResponse.Contents?.length !== 1 || !listResponse.Contents[0].Key) {
        return null
    }
    return listResponse.Contents[0].Key
}
const getExtensionForMIMEType = (type: string | undefined): ImageFileExtension => {
    switch (type) {
        case "image/bmp": {
            return "bmp"
        }
        case "image/gif": {
            return "gif"
        }
        case "image/jpeg": {
            return "jpeg"
        }
        case "image/png": {
            return "png"
        }
        case "image/svg+xml": {
            return "svg"
        }
        default: {
            throw 400
        }
    }
}
const index: NextApiHandler<string | null> = async (req, res) => {
    res.setHeader("accept", "image/bmp, image/gif, image/jpeg, image/png, image/svg+xml").setHeader(
        "accept-encoding",
        "identity",
    )
    try {
        const uuid = req.query.uuid
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, HEAD, OPTIONS, PUT")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method === "GET" || req.method === "HEAD") {
            const token = getBearerJWT(req.headers.authorization)
            const payload = await verifyJWT(token)
            if (!payload?.sub) {
                throw 401
            }
            const client = new S3Client({})
            try {
                const Key = await getImageSourceKey(client, payload.sub, uuid)
                if (!Key) {
                    throw 404
                }
                const options = {
                    Bucket: "contribute.phylopic.org",
                    Key,
                }
                const response = await client.send(
                    req.method === "GET" ? new GetObjectCommand(options) : new HeadObjectCommand(options),
                )
                response.ETag && res.setHeader("etag", response.ETag)
                response.ContentLength && res.setHeader("content-length", response.ContentLength)
                response.ContentType && res.setHeader("content-type", response.ContentType)
                if (includesETag(req.headers["if-none-match"], response.ETag)) {
                    res.status(304)
                } else {
                    res.status(200)
                    if (req.method === "GET") {
                        res.send(await streamToString(response.Body as Readable))
                    }
                }
            } finally {
                client.destroy()
            }
        } else if (req.method === "PUT") {
            const token = getBearerJWT(req.headers.authorization)
            const payload = await verifyJWT(token)
            if (!payload?.sub) {
                throw 401
            }
            const extension = getExtensionForMIMEType(req.headers["content-type"])
            if (!extension) {
                throw 400
            }
            const client = new S3Client({})
            try {
                const existingKey = await getImageSourceKey(client, payload.sub, uuid)
                if (existingKey) {
                    await client.send(
                        new DeleteObjectCommand({
                            Bucket: "contribute.phylopic.org",
                            Key: existingKey,
                        }),
                    )
                }
                const newKey = getContributionSourceKey(uuid, extension)
                const response = await client.send(
                    new PutObjectCommand({
                        Bucket: "contribute.phylopic.org",
                        Body: req.body,
                        ContentType: req.headers["content-type"],
                        Key: newKey,
                    }),
                )
                response.ETag && res.setHeader("etag", response.ETag)
                res.status(204)
            } finally {
                client.destroy()
            }
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
