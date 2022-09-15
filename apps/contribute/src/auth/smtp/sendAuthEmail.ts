import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"
import { JWT } from "@phylopic/source-models"
import { EmailAddress, isEmailAddress, isUUIDv4 } from "@phylopic/utils"
import decodeJWT from "../jwt/decodeJWT"
const sendAuthEmail = async (email: EmailAddress, token: JWT, now: Date) => {
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
    if (!duration || duration < 0) {
        throw new Error("Tried to send an email using an expired token.")
    }
    const url = `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/authorize/${encodeURIComponent(email)}/${encodeURIComponent(
        payload.jti,
    )}`
    const client = new SESClient({
        credentials: {
            accessKeyId: process.env.SES_ACCESS_KEY_ID!,
            secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
        },
        region: process.env.SES_REGION!,
    })
    const expiration = formatDate(expirationDate)
    try {
        const response = await client.send(
            new SendEmailCommand({
                Message: {
                    Body: {
                        Html: {
                            Data: `<p>Open this link to start uploading images to <i>PhyloPic</i>: <a href="${url}">${url}</a></p>
<p>This link will expire at ${expiration}.</p>
<p>Thanks! Can't wait to see your silhouettes.</p>
<br />
Mike Keesey<br />
<a href="mailto:keesey+phylopic@gmail.com">keesey+phylopic@gmail.com</a>`,
                        },
                        Text: {
                            Data: `Open this link to start uploading images to PhyloPic: ${url}

This link will expire at ${expiration}.

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
                Source: `keesey+phylopic@gmail.com`,
            }),
        )
        console.info("[EMAIL SENT]", response)
    } finally {
        client.destroy()
    }
}
export default sendAuthEmail
const formatDate = (date: Date) => {
    return [
        date.getUTCFullYear(),
        ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getUTCMonth()],
        date.getUTCDate(),
        "(" + ["Sunday", "Monday", "Tuesday", "Wednesdey", "Thursday", "Friday", "Saturday"][date.getUTCDay()] + ")",
        [getHour(date.getUTCHours()), padZeroes(date.getUTCMinutes(), 2)].join(":"),
        getAMPM(date.getUTCHours()),
        "UTC (Coordinated Universal Time)"
    ].join(" ")
}
const getAMPM = (hour: number) => hour < 12 ? "AM" : "PM"
const getHour = (hour: number) => hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
const padZeroes = (n: number, length: number) => {
    let s = n.toString(10)
    while (s.length < length) {
        s = "0" + s
    }
    return s
}