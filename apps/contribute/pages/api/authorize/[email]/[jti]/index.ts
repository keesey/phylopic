import { handleAPIError } from "@phylopic/source-client"
import { INCOMPLETE_STRING, JWT } from "@phylopic/source-models"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import SourceClient from "~/source/SourceClient"
const updateContributorEmailAddress = async (client: SourceClient, uuid: UUID, emailAddress: EmailAddress) => {
    const contributor = client.contributor(uuid)
    const existing = (await contributor.exists()) ? await contributor.get() : null
    if (existing?.emailAddress === emailAddress) {
        return null
    }
    await contributor.put({
        created: new Date().toISOString(),
        name: INCOMPLETE_STRING,
        showEmailAddress: true,
        ...existing,
        emailAddress,
        modified: new Date().toISOString(),
        uuid,
    })
}
const index: NextApiHandler<JWT> = async (req, res) => {
    let client: SourceClient | undefined
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
            client = new SourceClient()
            let token: JWT | undefined
            let expires: Date | null
            const authTokenClient = client.authToken(email)
            if (!(await authTokenClient.exists())) {
                throw 404
            }
            token = await authTokenClient.get()
            const payload = decodeJWT(token)
            if (payload?.jti !== jti || !isUUIDv4(payload.sub)) {
                throw 404
            }
            if (typeof payload.exp !== "number" || payload.exp * 1000 <= now.valueOf()) {
                throw 410
            }
            expires = new Date(payload.exp * 1000)
            await updateContributorEmailAddress(client, payload.sub, email)
            res.setHeader("expires", expires.toString())
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
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
