import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import getContributorTokenKey from "~/s3/keys/getContributorTokenKey"
import decodeJWT from "../jwt/decodeJWT"
import verifyJWT from "../jwt/verifyJWT"
import { JWT } from "../models/JWT"
const putJWT = async (client: S3Client, token: JWT, verify = false) => {
    const payload = verify ? await verifyJWT(token) : decodeJWT(token)
    if (!payload?.exp || !payload?.sub || !payload?.jti) {
        throw new Error("Invalid token.")
    }
    await client.send(
        new PutObjectCommand({
            Bucket: "contribute.phylopic.org",
            Body: token,
            ContentType: "application/jwt",
            Expires: new Date(payload.exp * 1000),
            Key: getContributorTokenKey(payload.sub, payload.jti),
        }),
    )
}
export default putJWT
