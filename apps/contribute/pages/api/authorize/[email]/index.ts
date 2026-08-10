import { handleAPIError } from "@phylopic/source-client"
import { verifyJWT } from "@phylopic/source-models"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import issueJWT from "~/auth/jwt/issueJWT"
import { checkAuthorizeRateLimit, getClientIp } from "~/auth/rateLimit/checkAuthorizeRateLimit"
import { resolveContributorUuidForEmail } from "~/auth/contributor/resolveContributorForEmail"
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
            if (!checkAuthorizeRateLimit(getClientIp(req.headers["x-forwarded-for"]), email)) {
                res.status(204)
            } else {
                client = new SourceClient()
                const ttl = getTTLFromBody(req.body)
                const authTokenClient = client.authToken(email)
                let preferredUuid: UUID | undefined
                if (await authTokenClient.exists()) {
                    const secret = process.env.AUTH_SECRET_KEY
                    const existingToken = await authTokenClient.get()
                    const payload = secret ? verifyJWT(existingToken, secret) : null
                    if (!isUUIDv4(payload?.sub)) {
                        throw 403
                    }
                    preferredUuid = payload.sub
                }
                const uuid = await resolveContributorUuidForEmail(client, email, preferredUuid)
                const token = await issueJWT(uuid, ttl, now)
                await authTokenClient.put(token)
                await sendAuthEmail(email, token, now)
                res.status(204)
            }
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
