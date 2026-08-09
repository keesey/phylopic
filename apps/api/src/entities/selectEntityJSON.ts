import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import { TableName } from "./TableName"
import selectEntityJSONFromPostgres from "./selectEntityJSONFromPostgres"
import selectEntityJSONFromS3 from "./selectEntityJSONFromS3"
const selectEntityJSON = async (
    client: ClientBase,
    tableName: TableName,
    uuid: UUID,
    userMessage = "There was an error retrieving data.",
): Promise<string> => {
    if (ENTITY_JSON_SOURCE === "postgres") {
        return selectEntityJSONFromPostgres(client, tableName, uuid, userMessage)
    }
    if (ENTITY_JSON_SOURCE === "s3") {
        const json = await selectEntityJSONFromS3(tableName, uuid)
        return json ?? "null"
    }
    try {
        const json = await selectEntityJSONFromS3(tableName, uuid)
        if (json !== null) {
            return json
        }
    } catch (e) {
        console.warn(`S3 entity read failed for ${tableName}/${uuid}, falling back to Postgres.`, e)
    }
    return selectEntityJSONFromPostgres(client, tableName, uuid, userMessage)
}
export default selectEntityJSON
