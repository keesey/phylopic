import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { convertS3BodyToString, isAWSError } from "@phylopic/utils-aws"
import BUILD from "../build/BUILD"
import { getResolveJSONKey } from "./getResolveJSONKey"

const client = new S3Client({})
const ENTITIES_BUCKET = process.env.ENTITIES_BUCKET ?? "entities.phylopic.org"

const selectResolveObjectJSONFromS3 = async (
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> => {
    try {
        const output = await client.send(
            new GetObjectCommand({
                Bucket: ENTITIES_BUCKET,
                Key: getResolveJSONKey(BUILD, authority, namespace, objectID),
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

export default selectResolveObjectJSONFromS3
