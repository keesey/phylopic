import { PutObjectTaggingCommand, S3Client } from "@aws-sdk/client-s3"
import { EmailAddress } from "@phylopic/utils"
import getContributorMetaKey from "~/s3/keys/getContributorMetaKey"
const putMetadataVerified = async (client: S3Client, email: EmailAddress, verified: boolean) => {
    await client.send(
        new PutObjectTaggingCommand({
            Bucket: "contribute.phylopic.org",
            Key: getContributorMetaKey(email),
            Tagging: {
                TagSet: [{ Key: "verified", Value: Boolean(verified).toString() }],
            },
        }),
    )
}
export default putMetadataVerified
