import { S3Client, HeadObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress } from "@phylopic/utils"
import { NextApiHandler } from "next"
import getBearerJWT from "~/auth/http/getBearerJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import { JWT } from "~/auth/models/JWT"
import putJWT from "~/auth/s3/putJWT"
import MAX_TTL from "~/auth/ttl/MAX_TTL"
import MIN_TTL from "~/auth/ttl/MIN_TTL"
const cleanExpiredJWTs = async (client: S3Client, email: EmailAddress, ContinuationToken?: string): Promise<void> => {
    try {
        const listOutput = await client.send(
            new ListObjectsV2Command({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                ContinuationToken,
                Prefix: `contributors/${encodeURIComponent(email)}/auth/`,
            }),
        )
        if (listOutput.Contents?.length) {
            await Promise.all(
                listOutput.Contents.map(async content => {
                    if (content.Key) {
                        try {
                            const headOutput = await client.send(
                                new HeadObjectCommand({
                                    Bucket: CONTRIBUTE_BUCKET_NAME,
                                    Key: content.Key,
                                }),
                            )
                            if (headOutput.Expires && headOutput.Expires.valueOf() <= new Date().valueOf()) {
                                await client.send(
                                    new DeleteObjectCommand({
                                        Bucket: CONTRIBUTE_BUCKET_NAME,
                                        Key: content.Key,
                                    }),
                                )
                            }
                        } catch (e) {
                            // Fail without killing the process.
                            console.error(e)
                        }
                    }
                }),
            )
        }
        if (listOutput.NextContinuationToken) {
            return await cleanExpiredJWTs(client, email, listOutput.NextContinuationToken)
        }
    } catch (e) {
        // Fail without killing the process.
        console.error(e)
    }
}
const handlePost = async (client: S3Client, authorization: string | undefined, ttl?: number): Promise<JWT> => {
    const token = getBearerJWT(authorization)
    const payload = await verifyJWT(token)
    if (!payload) {
        throw 401
    }
    if (!payload.sub || !payload.uuid) {
        throw 500
    }
    const newToken = await issueJWT(payload.sub, { uuid: payload.uuid }, ttl)
    await Promise.all([putJWT(client, newToken), cleanExpiredJWTs(client, payload.sub)])
    return newToken
}
const isValidPayload = (x: unknown): x is Readonly<{ ttl: number }> => {
    if (x && typeof x === "object" && typeof (x as { ttl: number }).ttl === "number") {
        return true
    }
    return false
}
const getTTL = (body: unknown) => {
    if (!isValidPayload(body)) {
        throw 400
    }
    if (!isFinite(body.ttl)) {
        throw 400
    }
    return Math.max(MIN_TTL, Math.min(MAX_TTL, body.ttl))
}
const index: NextApiHandler<string | null> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method === "POST") {
            const ttl = getTTL(req.body)
            let token: JWT
            const client = new S3Client({})
            try {
                token = await handlePost(client, req.headers.authorization, ttl)
            } finally {
                client.destroy()
            }
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
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
