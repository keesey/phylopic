import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { AUTH_BUCKET_NAME } from "@phylopic/source-models"
import { isEmailAddress, isUUID } from "@phylopic/utils"
import decodeJWT from "../jwt/decodeJWT"
import { JWT } from "../models/JWT"
import getTokenKey from "./getTokenKey"
const putToken = async (client: S3Client, token: JWT, expires: Date) => {
    const { sub: email, jti } = decodeJWT(token) ?? {}
    if (!isEmailAddress(email) || !isUUID(jti)) {
        throw new Error("Tried to save an invalid token.")
    }
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
