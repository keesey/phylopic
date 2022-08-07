import SourceClient from "@phylopic/source-client"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import { JWT } from "~/auth/models/JWT"
import handleAPIError from "~/errors/handleAPIError"
const updateContributorEmailAddress = async (client: SourceClient, uuid: UUID, emailAddress: EmailAddress) => {
    const contributor = client.sourceContributor(uuid)
    const existing = (await contributor.exists()) ? await contributor.get() : null
    if (existing?.emailAddress === emailAddress) {
        return null
    }
    await contributor.put({
        created: new Date().toISOString(),
        name: "Anonymous",
        showEmailAddress: true,
        ...existing,
        emailAddress,
    })
}
const index: NextApiHandler<string | null> = async (req, res) => {
    const now = new Date()
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, HEAD, OPTIONS")
            res.status(204)
        } else if (req.method === "GET" || req.method === "HEAD") {
            const email = req.query.email as EmailAddress
            const jti = req.query.jti as UUID
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(email, faultCollector.sub("email")) || !isUUIDv4(jti, faultCollector.sub("jti"))) {
                console.warn(faultCollector.list())
                throw 404
            }
            const client = new SourceClient()
            let token: JWT | undefined
            let expires: Date | null
            try {
                token = await client.authToken(email).get()
                const payload = decodeJWT(token)
                if (payload?.jti !== jti || !isUUIDv4(payload.sub)) {
                    throw 404
                }
                if (typeof payload.exp !== "number" || payload.exp * 1000 <= now.valueOf()) {
                    throw 410
                }
                expires = new Date(payload.exp * 1000)
                await updateContributorEmailAddress(client, payload.sub, email)
            } finally {
                client.destroy()
            }
            res.setHeader("expires", expires.toString())
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
