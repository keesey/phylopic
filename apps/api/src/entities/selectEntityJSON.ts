import { GetObjectCommand } from "@aws-sdk/client-s3"
import type { UUID } from "@phylopic/utils"
import { convertS3BodyToString, isAWSError } from "@phylopic/utils-aws"
import BUILD from "../build/BUILD"
import type { S3ClientService } from "../services/S3ClientService"
import { getEntityJSONKey } from "./getEntityJSONKey"
import type { TableName } from "./TableName"
import withS3Client from "./withS3Client"

const ENTITIES_BUCKET = process.env.ENTITIES_BUCKET ?? "entities.phylopic.org"

const selectEntityJSON = async (clientService: S3ClientService, tableName: TableName, uuid: UUID): Promise<string> => {
    const json = await withS3Client(clientService, async client => {
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
    })
    return json ?? "null"
}

export default selectEntityJSON
