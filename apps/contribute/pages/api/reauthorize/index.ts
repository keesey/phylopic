import { S3Client } from "@aws-sdk/client-s3"
import { NextApiHandler } from "next"
import getBearerJWT from "~/auth/http/getBearerJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import { JWT } from "~/auth/models/JWT"
import deleteExpiredJWTs from "~/auth/s3/deleteExpiredJWTs"
import putJWT from "~/auth/s3/putJWT"
import MAX_TTL from "~/auth/ttl/MAX_TTL"
import MIN_TTL from "~/auth/ttl/MIN_TTL"
const handlePost = async (client: S3Client, authorization: string | undefined, ttl?: number): Promise<JWT> => {
    const now = new Date()
    const token = getBearerJWT(authorization)
    const payload = await verifyJWT(token)
    if (!payload) {
        throw 401
    }
    if (!payload.sub || !payload.uuid) {
        throw 500
    }
    const newToken = await issueJWT(payload.sub, { uuid: payload.uuid }, ttl)
    await Promise.all([putJWT(client, newToken), deleteExpiredJWTs(client, payload.sub, now)])
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
