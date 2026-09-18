import type { S3Client } from "@aws-sdk/client-s3"
import type { Entity, Links } from "@phylopic/api-models"
import { type EntityFolder, getEntityJSONKey } from "@phylopic/s3-entities"
import type { FaultDetector, UUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import getS3EntityJSON from "./getS3EntityJSON"
import parseEntityJSONAndEmbed from "./parseEntityJSONAndEmbed"

const getEntityJSONWithEmbedded = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    client: S3Client,
    entityFolder: EntityFolder,
    uuid: UUID,
    embeds: ReadonlyArray<string & keyof TLinks>,
    detector: FaultDetector<TEntity>,
    typeUserLabel: string,
): Promise<string> => {
    const json = (await getS3EntityJSON(client, getEntityJSONKey(BUILD, entityFolder, uuid))) ?? "null"
    return parseEntityJSONAndEmbed<TEntity, TLinks>(client, json, embeds, detector, typeUserLabel)
}

export default getEntityJSONWithEmbedded
