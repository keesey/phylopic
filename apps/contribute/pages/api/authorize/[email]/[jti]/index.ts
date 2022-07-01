import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import { JWT } from "~/auth/models/JWT"
import getJWT from "~/auth/s3/getJWT"
import putMetadataVerified from "~/auth/s3/putMetadataVerified"
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
                throw 400
            }
            const client = new S3Client({})
            let token: JWT
            try {
                token = await getJWT(client, email, jti, true)
                await putMetadataVerified(client, email, true)
            } finally {
                client.destroy()
            }
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
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
