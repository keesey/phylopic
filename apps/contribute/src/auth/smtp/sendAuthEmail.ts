import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"
import { JWT } from "@phylopic/source-models"
import { EmailAddress, isEmailAddress, isUUIDv4 } from "@phylopic/utils"
import decodeJWT from "../jwt/decodeJWT"
const sendAuthEmail = async (email: EmailAddress, token: JWT, now: Date) => {
    if (!isEmailAddress(email)) {
        throw new Error("Tried to use an invalid email address.")
    }
    const payload = decodeJWT(token)
    const { exp, iat, jti, sub } = payload ?? {}
    if (!payload || !isUUIDv4(sub) || !isUUIDv4(jti) || typeof iat !== "number" || typeof exp !== "number") {
        throw new Error("Tried to send an email using an invalid token.")
    }
    const expirationDate = new Date(exp * 1000)
    const duration = expirationDate.valueOf() - now.valueOf()
    if (!duration || duration < 0) {
        throw new Error("Tried to send an email using an expired token.")
    }
    const url = `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/authorize/${encodeURIComponent(email)}/${encodeURIComponent(
        jti,
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
                            Data: `<body>
<p>Open this link to start uploading images to <i>PhyloPic</i>: <a href="${escapeHTML(url)}">${escapeHTML(url)}</a></p>
<p>This link will expire on ${escapeHTML(expiration)}.</p>
<p>Thanks! Can&rsquo;t wait to see your silhouettes.</p>
<br />
Mike Keesey<br />
<a href="mailto:keesey+phylopic@gmail.com">keesey+phylopic@gmail.com</a>
</body>`,
                        },
                        Text: {
                            Data: `Open this link to start uploading images to PhyloPic: ${url}

This link will expire on ${expiration}.

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
        [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ][date.getUTCMonth()],
        date.getUTCDate(),
        "(" + ["Sunday", "Monday", "Tuesday", "Wednesdey", "Thursday", "Friday", "Saturday"][date.getUTCDay()] + ")",
        "at",
        [getHour(date.getUTCHours()), padZeroes(date.getUTCMinutes(), 2)].join(":"),
        getAMPM(date.getUTCHours()),
        "UTC (Coordinated Universal Time)",
    ].join(" ")
}
const getAMPM = (hour: number) => (hour < 12 ? "AM" : "PM")
const getHour = (hour: number) => (hour === 0 ? 12 : hour > 12 ? hour - 12 : hour)
const padZeroes = (n: number, length: number) => {
    let s = n.toString(10)
    while (s.length < length) {
        s = "0" + s
    }
    return s
}
const escapeHTML = (s: string) =>
{
    return s
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&apos;");
 }