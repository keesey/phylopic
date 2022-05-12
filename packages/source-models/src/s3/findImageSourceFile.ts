import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
export const findImageSourceFile = async (client: S3Client, Bucket: string, Prefix: string) => {
    const listCommand = new ListObjectsV2Command({
        Bucket,
        MaxKeys: 1,
        Prefix,
    })
    const listResult = await client.send(listCommand)
    return listResult.Contents?.[0] ?? null
}
export default findImageSourceFile
