import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, isEmailAddress, stringifyNormalized, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler, NextApiRequest } from "next"
import isPayload from "~/auth/isPayload"
import issueJWT from "~/auth/jwt/issueJWT"
import Payload from "~/auth/Payload"
import getMetadata from "~/auth/s3/getMetadata"
import putJWT from "~/auth/s3/putJWT"
import putMetadata from "~/auth/s3/putMetadata"
import sendAuthEmail from "~/auth/smtp/sendAuthEmail"
const issueAndSendJWT = async (client: S3Client, email: EmailAddress, payload: Payload) => {
    const token = await issueJWT(email, payload)
    await putJWT(client, token)
    await sendAuthEmail(token)
}
const handleGet = async (client: S3Client, email: EmailAddress): Promise<Payload> => {
    const payload = await getMetadata(client, email, true)
    await issueAndSendJWT(client, email, payload)
    return { name: payload.name }
}
const handlePost = async (client: S3Client, email: EmailAddress, body: NextApiRequest["body"]) => {
    if (!isPayload(body)) {
        throw 400
    }
    let existingPayload: Payload | undefined
    try {
        existingPayload = await getMetadata(client, email, true)
    } catch (e) {
        if (e !== 401 && e !== 404) {
            throw e
        }
    }
    if (existingPayload && stringifyNormalized(existingPayload) !== stringifyNormalized(body)) {
        throw 401
    }
    if (!existingPayload) {
        await putMetadata(client, email, body)
    }
    await issueAndSendJWT(client, email, body)
}
const index: NextApiHandler<Payload | null> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, OPTIONS, POST")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method !== "GET" && req.method !== "POST") {
            throw 405
        } else {
            const email = req.query.email as EmailAddress
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(email, faultCollector.sub("email"))) {
                console.warn(faultCollector.list())
                throw 400
            }
            const client = new S3Client({})
            try {
                if (req.method === "GET") {
                    const payload = await handleGet(client, email)
                    res.json(payload)
                    res.status(200)
                } else {
                    await handlePost(client, email, req.body)
                    res.status(204)
                }
            } finally {
                client.destroy()
            }
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
