import { DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress } from "@phylopic/utils"
const deleteExpiredJWTs = async (
    client: S3Client,
    email: EmailAddress,
    now: Date,
    ContinuationToken?: string,
): Promise<void> => {
    try {
        const listOutput = await client.send(
            new ListObjectsV2Command({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                ContinuationToken,
                Prefix: `contributors/${encodeURIComponent(email)}/auth/`,
            }),
        )
        if (listOutput.Contents?.length) {
            await Promise.all(
                listOutput.Contents.map(async content => {
                    if (content.Key) {
                        try {
                            const headOutput = await client.send(
                                new HeadObjectCommand({
                                    Bucket: CONTRIBUTE_BUCKET_NAME,
                                    Key: content.Key,
                                }),
                            )
                            if (headOutput.Expires && headOutput.Expires.valueOf() <= now.valueOf()) {
                                await client.send(
                                    new DeleteObjectCommand({
                                        Bucket: CONTRIBUTE_BUCKET_NAME,
                                        Key: content.Key,
                                    }),
                                )
                            }
                        } catch (e) {
                            // Fail without killing the process.
                            console.error(e)
                        }
                    }
                }),
            )
        }
        if (listOutput.NextContinuationToken) {
            return await deleteExpiredJWTs(client, email, now, listOutput.NextContinuationToken)
        }
    } catch (e) {
        // Fail without killing the process.
        console.error(e)
    }
}
export default deleteExpiredJWTs
