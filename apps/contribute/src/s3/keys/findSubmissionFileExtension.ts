import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { UUID } from "@phylopic/utils"
import isImageFileExtension from "../isImageFileExtension"
import getSubmissionFileKeyPrefix from "./getSubmissionFileKeyPrefix"
const findSubmissionFileExtension = async (client: S3Client, uuid: UUID) => {
    const listResponse = await client.send(
        new ListObjectsV2Command({
            Bucket: "contribute.phylopic.org",
            MaxKeys: 1,
            Prefix: getSubmissionFileKeyPrefix(uuid),
        }),
    )
    const extension = listResponse.Contents?.[0]?.Key?.split(".", 2)[1]
    return isImageFileExtension(extension) ? extension : null
}
export default findSubmissionFileExtension
