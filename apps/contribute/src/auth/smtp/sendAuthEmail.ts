import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"
import { JWT } from "@phylopic/source-models"
import { EmailAddress, isEmailAddress, isUUIDv4 } from "@phylopic/utils"
import decodeJWT from "../jwt/decodeJWT"
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
    const url = `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/authorize/${encodeURIComponent(
        email,
    )}/${encodeURIComponent(payload.jti)}`
    const client = new SESClient({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        region: process.env.AWS_REGION!,
    })
    try {
        const response = await client.send(
            new SendEmailCommand({
                Message: {
                    Body: {
                        Html: {
                            Data: `<p>Open this link to start uploading images to <i>PhyloPic</i>: <a href="${url}"><code>${url}</code></a>.
This link will expire at ${expires.toUTCString()}.</p>
<p>Thanks! Can't wait to see your silhouettes.</p>
<br />
Mike Keesey<br />
<a href="mailto:keesey+phylopic@gmail.com"><code>keesey+phylopic@gmail.com</code></a>`,
                        },
                        Text: {
                            Data: `Open this link to start uploading images to PhyloPic: ${url}
This link will expire at ${expires.toUTCString()}.

Thanks! Can't wait to see your silhouettes.

Mike Keesey
keesey+phylopic@gmail.com`,
                        },
                    },
                    Subject: {
                        Data: "Uploading Silhouettes to PhyloPic",
                    },
                },
                Destination: {
                    ToAddresses: [email],
                },
                Source: `PhyloPic Contributions <no-reply@mail.phylopic.org>`,
            }),
        )
        console.info("[EMAIL SENT]", response)
    } finally {
        client.destroy()
    }
}
export default sendAuthEmail
