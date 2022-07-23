import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { AUTH_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress } from "@phylopic/utils"
import { streamToString } from "@phylopic/utils-aws"
import { Readable } from "stream"
import { JWT } from "~/auth/models/JWT"
import getTokenKey from "./getTOkenKey"
const getToken = async (client: S3Client, email: EmailAddress): Promise<Readonly<[JWT | null, Date | null]>> => {
    try {
        const response = await client.send(
            new GetObjectCommand({
                Bucket: AUTH_BUCKET_NAME,
                Key: getTokenKey(email),
            }),
        )
        if (response.$metadata.httpStatusCode === 200) {
            return [await streamToString(response.Body as Readable), response.Expires ?? null]
        }
    } catch (e) {
        console.error(e)
    }
    return [null, null]
}
export default getToken
