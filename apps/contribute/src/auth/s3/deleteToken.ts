import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { AUTH_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress } from "@phylopic/utils"
import getTokenKey from "./getTOkenKey"
const deleteToken = async (client: S3Client, email: EmailAddress): Promise<void> => {
    await client.send(
        new DeleteObjectCommand({
            Bucket: AUTH_BUCKET_NAME,
            Key: getTokenKey(email),
        }),
    )
}
export default deleteToken
