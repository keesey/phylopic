import { Entity, Links } from "@phylopic/api-models"
import { FaultDetector, UUID } from "@phylopic/utils"
import type { S3ClientService } from "../services/S3ClientService"
import parseEntityJSONAndEmbed from "./parseEntityJSONAndEmbed"
import selectEntityJSON from "./selectEntityJSON"
import { TableName } from "./TableName"

const selectEntityJSONWithEmbedded = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    service: S3ClientService,
    tableName: TableName,
    uuid: UUID,
    embeds: ReadonlyArray<string & keyof TLinks>,
    detector: FaultDetector<TEntity>,
    typeUserLabel: string,
): Promise<string> => {
    const json = await selectEntityJSON(service, tableName, uuid)
    return parseEntityJSONAndEmbed<TEntity, TLinks>(service, json, embeds, detector, typeUserLabel)
}

export default selectEntityJSONWithEmbedded
