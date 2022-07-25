import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, isEmailAddress, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler, NextApiRequest } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import isPayload from "~/auth/models/isPayload"
import Payload from "~/auth/models/Payload"
import getToken from "~/auth/s3/getToken"
import putToken from "~/auth/s3/putToken"
import sendAuthEmail from "~/auth/smtp/sendAuthEmail"
import isTTLPayload from "~/auth/ttl/isTTLPayload"
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
    const existingPayload = await getExistingPayload(client, email)
    const uuid: UUID = isPayload(existingPayload) ? existingPayload.uuid : randomUUID()
    const token = await issueJWT(email, { uuid }, body.ttl, now)
    const expires = new Date(now.valueOf() + 24 * 60 * 60 * 1000)
    await putToken(client, token, expires)
    await sendAuthEmail(token, now, expires)
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
        handleAPIError(res, e)
    }
    res.end()
}
export default index
