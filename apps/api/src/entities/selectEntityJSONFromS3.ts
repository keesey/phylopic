import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { convertS3BodyToString, isAWSError } from "@phylopic/utils-aws"
import { UUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import { TableName } from "./TableName"
import { getEntityJSONKey } from "./getEntityJSONKey"
const ENTITIES_BUCKET = process.env.ENTITIES_BUCKET ?? "entities.phylopic.org"
const selectEntityJSONFromS3 = async (client: S3Client, tableName: TableName, uuid: UUID): Promise<string | null> => {
    try {
        const output = await client.send(
            new GetObjectCommand({
                Bucket: ENTITIES_BUCKET,
                Key: getEntityJSONKey(BUILD, tableName, uuid),
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
export default selectEntityJSONFromS3
