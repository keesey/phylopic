import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { UUID } from "@phylopic/utils"
import { createAwsClientConfig } from "@phylopic/utils-aws"
// :TODO: Set in one place? Also used in @phylopic/source-client's ImageClient.
const BUCKET_NAME = "source-images.phylopic.org"
const getKey = (uuid: UUID) => `images/${encodeURIComponent(uuid)}/source`
const EXPIRATION_SECONDS = 300 // Five minutes
const CLIENT = new S3Client(
    createAwsClientConfig({
        region: process.env.S3_REGION!,
        accessKeyIdEnv: "S3_ACCESS_KEY_ID",
        secretAccessKeyEnv: "S3_SECRET_ACCESS_KEY",
        forcePathStyle: true, // Dots in the bucket name break TLS with virtual-hosted-style URLs.
    }),
) as Parameters<typeof getSignedUrl>[0]
const getSourceImageFileURL = (uuid: UUID) =>
    getSignedUrl(
        CLIENT,
        new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: getKey(uuid),
            ResponseContentDisposition: "attachment",
        }),
        { expiresIn: EXPIRATION_SECONDS },
    )
export default getSourceImageFileURL
