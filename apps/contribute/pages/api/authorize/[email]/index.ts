import { handleAPIError } from "@phylopic/source-client"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import sendAuthEmail from "~/auth/smtp/sendAuthEmail"
import getTTLFromBody from "~/auth/ttl/getTTLFromBody"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<void> = async (req, res) => {
    const now = new Date()
    let client: SourceClient | undefined
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.status(204)
        } else if (req.method === "POST") {
            const email = req.query.email as EmailAddress
            if (!isEmailAddress(email)) {
                throw 404
            }
            const client = new SourceClient()
            const ttl = getTTLFromBody(req.body)
            const authTokenClient = client.authToken(email)
            let uuid: UUID
            if (await authTokenClient.exists()) {
                const { sub } = decodeJWT(await authTokenClient.get()) ?? {}
                if (!isUUIDv4(sub)) {
                    throw 403
                }
                uuid = sub
            } else {
                uuid = randomUUID()
            }
            const token = await issueJWT(uuid, ttl, now)
            await authTokenClient.put(token)
            await sendAuthEmail(email, token, now)
            res.status(204)
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
