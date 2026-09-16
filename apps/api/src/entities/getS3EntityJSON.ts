import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { ENTITIES_BUCKET } from "@phylopic/s3-entities"
import { convertS3BodyToString, isAWSError } from "@phylopic/utils-aws"

const getS3EntityJSON = async (client: S3Client, key: string): Promise<string | null> => {
    try {
        const output = await client.send(
            new GetObjectCommand({
                Bucket: ENTITIES_BUCKET,
                Key: key,
            }),
        )
        return await convertS3BodyToString(output.Body)
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode === 404) {
            return null
        }
        if (e instanceof Error && e.name === "NoSuchKey") {
            return null
        }
        throw e
    }
}

export default getS3EntityJSON
