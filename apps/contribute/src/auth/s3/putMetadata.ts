import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress, stringifyNormalized, UUID } from "@phylopic/utils"
import getContributorMetaKey from "~/s3/keys/contribute/getContributorMetaKey"
const getExpiration = () => {
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 1)
    return expiration
}
const putMetadata = async (client: S3Client, email: EmailAddress, body: { uuid: UUID }, verified = false) => {
    await client.send(
        new PutObjectCommand({
            Bucket: CONTRIBUTE_BUCKET_NAME,
            Body: stringifyNormalized(body),
            ContentType: "application/json",
            Expires: verified ? undefined : getExpiration(),
            Key: getContributorMetaKey(email),
            Tagging: `verified=${encodeURIComponent(verified.toString())}`,
        }),
    )
}
export default putMetadata
