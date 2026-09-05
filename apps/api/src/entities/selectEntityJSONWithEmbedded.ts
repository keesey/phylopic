import { S3Client } from "@aws-sdk/client-s3"
import { Entity, Links } from "@phylopic/api-models"
import { EntityFolder, getEntityJSONKey } from "@phylopic/s3-entities"
import { FaultDetector, UUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import parseEntityJSONAndEmbed from "./parseEntityJSONAndEmbed"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectEntityJSONWithEmbedded = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    client: S3Client,
    entityFolder: EntityFolder,
    uuid: UUID,
    embeds: ReadonlyArray<string & keyof TLinks>,
    detector: FaultDetector<TEntity>,
    typeUserLabel: string,
): Promise<string> => {
    const json = (await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, entityFolder, uuid))) ?? "null"
    return parseEntityJSONAndEmbed<TEntity, TLinks>(client, json, embeds, detector, typeUserLabel)
}

export default selectEntityJSONWithEmbedded
