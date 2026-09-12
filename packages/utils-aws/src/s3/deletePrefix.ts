import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
export const deletePrefix = async (client: S3Client, bucket: string, prefix: string) => {
    let continuationToken: string | undefined
    do {
        const list = await client.send(
            new ListObjectsV2Command({
                Bucket: bucket,
                ContinuationToken: continuationToken,
                Prefix: prefix,
            }),
        )
        const keys = list.Contents?.map(({ Key }) => Key).filter((key): key is string => !!key) ?? []
        if (keys.length > 0) {
            await client.send(
                new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: {
                        Objects: keys.map(Key => ({ Key })),
                    },
                }),
            )
        }
        continuationToken = list.NextContinuationToken
    } while (continuationToken)
}
