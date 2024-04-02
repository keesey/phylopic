import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { isAWSError } from "@phylopic/utils-aws"
export const exists = async (client: S3Client, Bucket: string, Key: string): Promise<boolean> => {
    try {
        const output = await client.send(
            new HeadObjectCommand({
                Bucket,
                Key,
            }),
        )
        return typeof output.$metadata.httpStatusCode === "number" && output.$metadata.httpStatusCode === 200
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
            return false
        }
        throw e
    }
}
