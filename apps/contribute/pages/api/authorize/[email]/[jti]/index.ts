import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import { JWT } from "~/auth/models/JWT"
import getToken from "~/auth/s3/getToken"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<string | null> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, OPTIONS")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method !== "GET") {
            throw 405
        } else {
            const email = req.query.email as EmailAddress
            const jti = req.query.jti as UUID
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(email, faultCollector.sub("email")) || !isUUIDv4(jti, faultCollector.sub("jti"))) {
                console.warn(faultCollector.list())
                throw 404
            }
            const client = new S3Client({})
            let token: JWT | null
            try {
                let expires: Date | null
                ;[token, expires] = await getToken(client, email)
                if (!token) {
                    throw 404
                }
                if (expires && expires.valueOf() <= new Date().valueOf()) {
                    throw 410
                }
                const payload = decodeJWT(token)
                if (payload?.jti !== jti) {
                    throw 404
                }
            } finally {
                client.destroy()
            }
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
