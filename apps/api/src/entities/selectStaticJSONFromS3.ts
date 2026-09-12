import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { convertS3BodyToString, isAWSError } from "@phylopic/utils-aws"
import BUILD from "../build/BUILD"
import { getStaticJSONKey, StaticJSONName } from "./getStaticJSONKey"

const client = new S3Client({})
const ENTITIES_BUCKET = process.env.ENTITIES_BUCKET ?? "entities.phylopic.org"

const selectStaticJSONFromS3 = async (name: StaticJSONName): Promise<string | null> => {
    try {
        const output = await client.send(
            new GetObjectCommand({
                Bucket: ENTITIES_BUCKET,
                Key: getStaticJSONKey(BUILD, name),
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

export default selectStaticJSONFromS3
