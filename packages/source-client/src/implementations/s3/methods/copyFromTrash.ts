import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3"
export const copyFromTrash = async (client: S3Client, Bucket: string, Key: string) => {
    await client.send(
        new CopyObjectCommand({
            Bucket,
            CopySource: encodeURI(`/${Bucket}/trash/${Key}`),
            Key,
        }),
    )
}
