import { isEmailAddress, isUUID } from "@phylopic/utils"
import formData from "form-data"
import Mailgun from "mailgun.js"
import { MailgunMessageData } from "mailgun.js/interfaces/Messages"
import decodeJWT from "../jwt/decodeJWT"
import { JWT } from "../models/JWT"
const sendAuthEmail = async (token: JWT, now: Date, expires: Date) => {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        throw new Error("The server is missing certain data required to send email.")
    }
    const payload = decodeJWT(token)
    if (!payload?.iat || !isEmailAddress(payload?.sub) || !isUUID(payload?.jti) || typeof payload.exp !== "number") {
        throw new Error("Tried to send an email using an invalid token.")
    }
    const expirationDate = new Date(payload.exp * 1000)
    const duration = expirationDate.valueOf() - now.valueOf()
    if (duration < 0) {
        throw new Error("Tried to send an email using an expired token.")
    }
    const messageData: MailgunMessageData = {
        from: `PhyloPic Contributions <no-reply@${process.env.MAILGUN_DOMAIN}>`,
        subject: "Uploading Silhouettes to PhyloPic",
        text: `Hey there,
        
Open this link to start uploading images to PhyloPic: https://contribute.phylopic.org/authorize/${encodeURIComponent(
            payload.sub,
        )}/${encodeURIComponent(payload.jti)}
This link will expire at ${expires.toUTCString()}.

Thanks! Can't wait to see your silhouettes.
`,
        to: payload.sub,
    }
    const mailgun = new Mailgun(formData)
    const client = mailgun.client({
        key: process.env.MAILGUN_API_KEY,
        username: "api",
    })
    const response = await client.messages.create(process.env.MAILGUN_DOMAIN, messageData)
    console.info("[EMAIL SENT]", response)
}
export default sendAuthEmail
