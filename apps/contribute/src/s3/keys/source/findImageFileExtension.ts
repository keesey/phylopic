import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import isImageFileExtension from "../../isImageFileExtension"
import getImageFileKeyPrefix from "./getImageFileKeyPrefix"
const findImageFileExtension = async (client: S3Client, uuid: UUID) => {
    const listResponse = await client.send(
        new ListObjectsV2Command({
            Bucket: SOURCE_BUCKET_NAME,
            MaxKeys: 1,
            Prefix: getImageFileKeyPrefix(uuid),
        }),
    )
    const extension = listResponse.Contents?.[0]?.Key?.split(".", 2)[1]
    return isImageFileExtension(extension) ? extension : null
}
export default findImageFileExtension
