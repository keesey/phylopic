import SourceClient from "@phylopic/source-client"
import { EmailAddress, isUUIDv4, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler, NextApiRequest } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import sendAuthEmail from "~/auth/smtp/sendAuthEmail"
import getTTLFromBody from "~/auth/ttl/getTTLFromBody"
import handleAPIError from "~/errors/handleAPIError"
const handlePost = async (client: SourceClient, email: EmailAddress, body: NextApiRequest["body"]) => {
    const ttl = getTTLFromBody(body)
    const now = new Date()
    const authToken = client.authToken(email)
    const { sub } = decodeJWT(await authToken.get()) ?? {}
    const uuid: UUID = isUUIDv4(sub) ? sub : randomUUID()
    const token = await issueJWT(uuid, ttl, now)
    await authToken.put(token)
    await sendAuthEmail(email, token, now, new Date(now.valueOf() + ttl))
}
const index: NextApiHandler<void> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.status(204)
        } else if (req.method === "POST") {
            const email = req.query.email as EmailAddress
            const client = new SourceClient()
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
