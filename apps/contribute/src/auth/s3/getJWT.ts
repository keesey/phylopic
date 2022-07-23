import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress, UUID } from "@phylopic/utils"
import { streamToString } from "@phylopic/utils-aws"
import { Readable } from "stream"
import verifyJWT from "~/auth/jwt/verifyJWT"
import { JWT } from "~/auth/models/JWT"
import getContributorTokenKey from "~/s3/keys/contribute/getContributorTokenKey"
import decodeJWT from "../jwt/decodeJWT"
const getJWT = async (client: S3Client, email: EmailAddress, jti: UUID, verify = false): Promise<JWT> => {
    const response = await client.send(
        new GetObjectCommand({
            Bucket: CONTRIBUTE_BUCKET_NAME,
            Key: getContributorTokenKey(email, jti),
        }),
    )
    const token = await streamToString(response.Body as Readable)
    const payload = verify ? await verifyJWT(token) : decodeJWT(token)
    if (!payload) {
        throw 401
    }
    return token
}
export default getJWT
