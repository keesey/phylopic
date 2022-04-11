import { GetObjectCommand, GetObjectOutput, S3Client } from "@aws-sdk/client-s3"
import APIError from "../errors/APIError"
import convertS3BodyToString from "../utils/aws/convertS3BodyToString"
import isAWSError from "../utils/aws/isAWSError"
import getJSONKey from "./getJSONKey"
export const readJSON = async (s3Client: S3Client, path: string, userMessage: string, bucket = "data.phylopic.org") => {
    const key = getJSONKey(path)
    let file: GetObjectOutput
    try {
        file = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            }),
        )
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode === 404) {
            throw new APIError(404, [
                {
                    developerMessage: `${e} (Key: ${key})`,
                    type: "RESOURCE_NOT_FOUND",
                    userMessage,
                },
            ])
        }
        throw e
    }
    return (await convertS3BodyToString(file.Body)) ?? "null"
}
export default readJSON
