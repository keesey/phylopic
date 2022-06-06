import { S3Client } from "@aws-sdk/client-s3"
import { NextApiHandler } from "next"
import getBearerJWT from "~/auth/http/getBearerJWT"
import { JWT } from "~/auth/JWT"
import issueJWT from "~/auth/jwt/issueJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import putJWT from "~/auth/s3/putJWT"
const MAX_TTL = 365 * 24 * 60 * 60 * 1000
const MIN_TTL = 60 * 1000
const handlePost = async (client: S3Client, authorization: string | undefined, ttl?: number): Promise<JWT> => {
    const token = getBearerJWT(authorization)
    const payload = await verifyJWT(token)
    if (!payload) {
        throw 401
    }
    if (!payload.sub || !payload.name) {
        throw 500
    }
    const newToken = await issueJWT(payload.sub, { name: payload.name }, ttl)
    await putJWT(client, newToken)
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
        } else if (req.method !== "POST") {
            throw 405
        } else {
            const ttl = getTTL(req.body)
            const client = new S3Client({})
            let token: JWT
            try {
                token = await handlePost(client, req.headers.authorization, ttl)
            } finally {
                client.destroy()
            }
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
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
