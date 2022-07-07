import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, isEmailAddress, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler, NextApiRequest } from "next"
import issueJWT from "~/auth/jwt/issueJWT"
import isPayload from "~/auth/models/isPayload"
import Payload from "~/auth/models/Payload"
import getMetadata from "~/auth/s3/getMetadata"
import putJWT from "~/auth/s3/putJWT"
import putMetadata from "~/auth/s3/putMetadata"
import sendAuthEmail from "~/auth/smtp/sendAuthEmail"
import DEFAULT_TTL from "~/auth/ttl/DEFAULT_TTL"
import isTTLPayload from "~/auth/ttl/isTTLPayload"
import MAX_TTL from "~/auth/ttl/MAX_TTL"
import MIN_TTL from "~/auth/ttl/MIN_TTL"
const issueAndSendJWT = async (client: S3Client, email: EmailAddress, uuid: UUID, ttl: number) => {
    const token = await issueJWT(email, { uuid }, ttl)
    await putJWT(client, token)
    await sendAuthEmail(token)
}
const handlePost = async (client: S3Client, email: EmailAddress, body: NextApiRequest["body"]) => {
    if (!isTTLPayload(body)) {
        throw 400
    }
    let existingPayload: unknown
    try {
        existingPayload = await getMetadata(client, email, false)
    } catch (e) {
        if (e !== 401 && e !== 404) {
            throw e
        }
    }
    let uuid: UUID
    if (isPayload(existingPayload)) {
        uuid = existingPayload.uuid
    } else {
        uuid = randomUUID()
        await putMetadata(client, email, { uuid }, false)
    }
    const ttl = Math.max(MIN_TTL, Math.min(MAX_TTL, body.ttl ?? DEFAULT_TTL))
    await issueAndSendJWT(client, email, uuid, ttl)
}
const index: NextApiHandler<Payload | null> = async (req, res) => {
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
