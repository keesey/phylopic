import formData from "form-data"
import Mailgun from "mailgun.js"
import { JWT } from "../JWT"
import decodeJWT from "../jwt/decodeJWT"
import verifyJWT from "../jwt/verifyJWT"
const sendAuthEmail = async (token: JWT, verify = false) => {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        throw new Error("The server is missing certain data required to send email.")
    }
    const payload = verify ? await verifyJWT(token) : decodeJWT(token)
    if (!payload?.jti || !payload.iat || !payload.name || !payload.sub) {
        throw new Error("Invalid token.")
    }
    const messageData = {
        from: `PhyloPic Contributions <no-reply@${process.env.MAILGUN_DOMAIN}>`,
        to: payload.sub,
        subject: "Contributing Silhouettes to PhyloPic",
        text: `Hey ${payload.name},
        
Open this link to start uploading images to PhyloPic: https://contribute.phylopic.org/authorize/${encodeURIComponent(
            payload.sub,
        )}/${encodeURIComponent(payload.jti)}

Thanks! Can't wait to see them.
`,
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
