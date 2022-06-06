import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { EmailAddress } from "@phylopic/utils"
import Payload from "~/auth/Payload"
const getExpiration = () => {
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 1)
    return expiration
}
const putMetadata = async (client: S3Client, email: EmailAddress, payload: Payload, verified = false) => {
    await client.send(
        new PutObjectCommand({
            Bucket: "contribute.phylopic.org",
            Body: JSON.stringify(payload),
            ContentType: "application/json",
            Expires: verified ? undefined : getExpiration(),
            Key: `contributors/${encodeURIComponent(email)}/meta.json`,
            Tagging: `verified=${encodeURIComponent(verified.toString())}`,
        }),
    )
}
export default putMetadata
