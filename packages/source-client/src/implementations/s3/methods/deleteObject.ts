import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
export const deleteObject = async (client: S3Client, Bucket: string, Key: string) => {
    await client.send(
        new DeleteObjectCommand({
            Bucket,
            Key,
        }),
    )
}
