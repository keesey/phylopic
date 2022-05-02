import { ClientBase } from "pg"
import { Entity } from "phylopic-api-models/dist/types/Entity"
import { Links } from "phylopic-api-models/dist/types/Links"
import { FaultDetector } from "phylopic-utils/dist/detection/FaultDetector"
import { UUID } from "phylopic-utils/dist/models/types/UUID"
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
