import { Entity, Links } from "@phylopic/api-models"
import { S3Client } from "@aws-sdk/client-s3"
import { FaultDetector, UUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import { getEntityJSONKey } from "./getEntityJSONKey"
import parseEntityJSONAndEmbed from "./parseEntityJSONAndEmbed"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"
import { TableName } from "./TableName"

const selectEntityJSONWithEmbedded = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    client: S3Client,
    tableName: TableName,
    uuid: UUID,
    embeds: ReadonlyArray<string & keyof TLinks>,
    detector: FaultDetector<TEntity>,
    typeUserLabel: string,
): Promise<string> => {
    const json = (await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, tableName, uuid))) ?? "null"
    return parseEntityJSONAndEmbed<TEntity, TLinks>(client, json, embeds, detector, typeUserLabel)
}

export default selectEntityJSONWithEmbedded
