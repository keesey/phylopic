import type { Entity, Links } from "@phylopic/api-models"
import { FaultDetector } from "@phylopic/utils"
import type { S3ClientService } from "../services/S3ClientService"
import parseEntityJSON from "./parseEntityJSON"
import selectEntityEmbeds from "./selectEntityEmbeds"
const parseEntityJSONAndEmbed = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    service: S3ClientService,
    json: string,
    embeds: ReadonlyArray<string & keyof TLinks>,
    detector: FaultDetector<TEntity>,
    typeUserLabel: string,
): Promise<string> => {
    if (!embeds.length) {
        return json
    }
    const entity = parseEntityJSON<TEntity | null>(json, detector)
    if (!entity) {
        return "null"
    }
    const embeddedJSON = await selectEntityEmbeds(service, entity._links, embeds, typeUserLabel)
    return '{"_embedded":' + embeddedJSON + "," + json.slice(1)
}
export default parseEntityJSONAndEmbed
