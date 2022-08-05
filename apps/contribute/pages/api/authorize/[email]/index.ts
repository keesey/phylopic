import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler, NextApiRequest } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import getToken from "~/auth/s3/getToken"
import putToken from "~/auth/s3/putToken"
import sendAuthEmail from "~/auth/smtp/sendAuthEmail"
import DEFAULT_TTL from "~/auth/ttl/DEFAULT_TTL"
import isTTLPayload from "~/auth/ttl/isTTLPayload"
import MAX_TTL from "~/auth/ttl/MAX_TTL"
import MIN_TTL from "~/auth/ttl/MIN_TTL"
import handleAPIError from "~/errors/handleAPIError"
const getExistingPayload = async (client: S3Client, email: EmailAddress) => {
    try {
        const [token] = await getToken(client, email)
        if (token) {
            return decodeJWT(token)
        }
    } catch {
        return null
    }
}
const handlePost = async (client: S3Client, email: EmailAddress, body: NextApiRequest["body"]) => {
    if (!isTTLPayload(body)) {
        throw 400
    }
    const now = new Date()
    const { sub } = (await getExistingPayload(client, email)) ?? {}
    const uuid: UUID = isUUIDv4(sub) ? sub : randomUUID()
    let { ttl } = body
    if (typeof ttl !== "number") {
        ttl = DEFAULT_TTL
    } else if (ttl < MIN_TTL) {
        ttl = MIN_TTL
    } else if (ttl > MAX_TTL) {
        ttl = MAX_TTL
    } else if (!isFinite(ttl)) {
        ttl = DEFAULT_TTL
    }
    const token = await issueJWT(uuid, ttl, now)
    const expires = new Date(now.valueOf() + ttl)
    await putToken(client, email, token, expires)
    await sendAuthEmail(email, token, now, expires)
}
const index: NextApiHandler<{ uuid: UUID } | null> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method === "POST") {
            const email = req.query.email as EmailAddress
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(email, faultCollector.sub("email"))) {
                console.warn(faultCollector.list())
                throw 400
            }
            const client = new S3Client({})
            try {
                await handlePost(client, email, req.body)
                res.status(204)
            } finally {
                client.destroy()
            }
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
