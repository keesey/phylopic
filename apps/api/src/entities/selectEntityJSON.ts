import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import type { UUID } from "@phylopic/utils"
import { convertS3BodyToString, isAWSError } from "@phylopic/utils-aws"
import BUILD from "../build/BUILD"
import { getEntityJSONKey } from "./getEntityJSONKey"
import type { TableName } from "./TableName"

const ENTITIES_BUCKET = process.env.ENTITIES_BUCKET ?? "entities.phylopic.org"

const selectEntityJSON = async (client: S3Client, tableName: TableName, uuid: UUID): Promise<string> => {
    try {
        const output = await client.send(
            new GetObjectCommand({
                Bucket: ENTITIES_BUCKET,
                Key: getEntityJSONKey(BUILD, tableName, uuid),
            }),
        )
        const json = await convertS3BodyToString(output.Body)
        return json ?? "null"
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode === 404) {
            return "null"
        }
        if (e instanceof Error && e.name === "NoSuchKey") {
            return "null"
        }
        throw e
    }
}

export default selectEntityJSON
