import { S3Client } from "@aws-sdk/client-s3"
import type { UUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import { getEntityJSONKey } from "./getEntityJSONKey"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"
import type { TableName } from "./TableName"

const selectEntityJSON = async (client: S3Client, tableName: TableName, uuid: UUID): Promise<string> => {
    const json = await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, tableName, uuid))
    return json ?? "null"
}

export default selectEntityJSON
