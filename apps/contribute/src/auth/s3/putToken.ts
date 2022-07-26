import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { AUTH_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress } from "@phylopic/utils"
import { JWT } from "../models/JWT"
import getTokenKey from "./getTokenKey"
const putToken = async (client: S3Client, email: EmailAddress, token: JWT, expires: Date) => {
    await client.send(
        new PutObjectCommand({
            Bucket: AUTH_BUCKET_NAME,
            Body: token,
            ContentType: "application/jwt",
            Expires: expires,
            Key: getTokenKey(email),
        }),
    )
}
export default putToken
