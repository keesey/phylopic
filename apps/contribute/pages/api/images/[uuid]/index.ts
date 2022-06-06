import {
    GetObjectCommand,
    GetObjectCommandOutput,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3"
import { isUUIDv4 } from "@phylopic/utils"
import { streamToString } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import { Readable } from "stream"
import getBearerJWT from "~/auth/http/getBearerJWT"
import includesETag from "~/auth/http/includesETag"
import verifyJWT from "~/auth/jwt/verifyJWT"
import getImageSourceKey from "~/auth/s3/getImageSourceKey"
const index: NextApiHandler<string | null> = async (req, res) => {
    res.setHeader("accept", "application/json").setHeader("accept-encoding", "identity")
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
                const Key = `/contributors/${encodeURIComponent(payload.sub)}/images/${encodeURIComponent(
                    uuid,
                )}/meta.json`
                const options = {
                    Bucket: "contribute.phylopic.org",
                    Key,
                }
                let response: GetObjectCommandOutput
                try {
                    response = await client.send(
                        req.method === "GET" ? new GetObjectCommand(options) : new HeadObjectCommand(options),
                    )
                } catch (e) {
                    const imageSourceKey = await getImageSourceKey(client, payload.sub, uuid)
                    if (!imageSourceKey) {
                        throw 401
                    } else {
                        throw 204
                    }
                }
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
            const client = new S3Client({})
            try {
                const Key = `contributors/${encodeURIComponent(payload.sub)}/images/${encodeURIComponent(
                    uuid.toLowerCase(),
                )}/meta.json`
                const response = await client.send(
                    new PutObjectCommand({
                        Bucket: "contribute.phylopic.org",
                        Body: req.body,
                        ContentType: "application/json",
                        Key,
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
