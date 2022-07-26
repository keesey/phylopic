import { EmailAddress, isEmailAddress, isUUID, isUUIDv4 } from "@phylopic/utils"
import formData from "form-data"
import Mailgun from "mailgun.js"
import { MailgunMessageData } from "mailgun.js/interfaces/Messages"
import decodeJWT from "../jwt/decodeJWT"
import { JWT } from "../models/JWT"
const sendAuthEmail = async (email: EmailAddress, token: JWT, now: Date, expires: Date) => {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        throw new Error("The server is missing certain data required to send email.")
    }
    if (!isEmailAddress(email)) {
        throw new Error("Tried to use an invalid email address.")
    }
    const payload = decodeJWT(token)
    if (
        !payload ||
        !isUUIDv4(payload?.sub) ||
        !isUUIDv4(payload?.jti) ||
        typeof payload.iat !== "number" ||
        typeof payload.exp !== "number"
    ) {
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
            email,
        )}/${encodeURIComponent(payload.jti)}
This link will expire at ${expires.toUTCString()}.

Thanks! Can't wait to see your silhouettes.
`,
        to: email,
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
