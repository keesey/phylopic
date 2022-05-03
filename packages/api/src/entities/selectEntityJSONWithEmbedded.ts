import { Entity, Links } from "@phylopic/api-models"
import { FaultDetector, UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import parseEntityJSONAndEmbed from "./parseEntityJSONAndEmbed"
import selectEntityJSON from "./selectEntityJSON"
import { TableName } from "./TableName"
const selectEntityJSONWithEmbedded = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    client: ClientBase,
    tableName: TableName,
    uuid: UUID,
    embeds: ReadonlyArray<string & keyof TLinks>,
    detector: FaultDetector<TEntity>,
    typeUserLabel: string,
): Promise<string> => {
    const json = await selectEntityJSON(client, tableName, uuid)
    return parseEntityJSONAndEmbed<TEntity, TLinks>(client, json, embeds, detector, typeUserLabel)
}
export default selectEntityJSONWithEmbedded
