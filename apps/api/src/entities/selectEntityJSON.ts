import type { UUID } from "@phylopic/utils"
import type { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import type { TableName } from "./TableName"
import selectEntityJSONFromPostgres from "./selectEntityJSONFromPostgres"
import selectEntityJSONFromS3 from "./selectEntityJSONFromS3"
import withS3Client from "./withS3Client"

const selectEntityJSON = async (
    clientService: PgClientService & S3ClientService,
    tableName: TableName,
    uuid: UUID,
    userMessage = "There was an error retrieving data.",
): Promise<string> => {
    if (ENTITY_JSON_SOURCE === "postgres") {
        return selectEntityJSONFromPostgres(await clientService.createPgClient(), tableName, uuid, userMessage)
    }
    if (ENTITY_JSON_SOURCE === "s3") {
        const json = await withS3Client(clientService, client => selectEntityJSONFromS3(client, tableName, uuid))
        return json ?? "null"
    }
    try {
        const json = await withS3Client(clientService, client => selectEntityJSONFromS3(client, tableName, uuid))
        if (json !== null) {
            return json
        }
    } catch (e) {
        console.warn(`S3 entity read failed for ${tableName}/${uuid}, falling back to Postgres.`, e)
    }
    return selectEntityJSONFromPostgres(await clientService.createPgClient(), tableName, uuid, userMessage)
}

export default selectEntityJSON
