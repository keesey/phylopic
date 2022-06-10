import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, UUID } from "@phylopic/utils"
const getImageSourceKey = async (client: S3Client, email: EmailAddress, uuid: UUID) => {
    const listResponse = await client.send(
        new ListObjectsV2Command({
            Bucket: "contribute.phylopic.org",
            MaxKeys: 1,
            Prefix: `contributors/${encodeURIComponent(email)}/images/${encodeURIComponent(
                uuid.toLowerCase(),
            )}/source.`,
        }),
    )
    if (listResponse.Contents?.length !== 1 || !listResponse.Contents[0].Key) {
        return null
    }
    return listResponse.Contents[0].Key
}
export default getImageSourceKey
