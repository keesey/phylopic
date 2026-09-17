import { HeadObjectCommand, HeadObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import { isAWSError } from "../errors"
export const objectExists = async (client: S3Client, input: HeadObjectCommandInput) => {
    const command = new HeadObjectCommand(input)
    try {
        await client.send(command)
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
            return false
        }
        throw e
    }
    return true
}
