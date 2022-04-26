import { ClientBase } from "pg"
import { Entity, Links } from "phylopic-api-models"
import { FaultDetector } from "phylopic-utils"
import parseEntityJSON from "./parseEntityJSON"
import selectEntityEmbeds from "./selectEntityEmbeds"
const parseEntityJSONAndEmbed = async <TEntity extends Entity<TLinks>, TLinks extends Links>(
    client: ClientBase,
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
    const embeddedJSON = await selectEntityEmbeds(client, entity._links, embeds, typeUserLabel)
    return '{"_embedded":' + embeddedJSON + "," + json.slice(1)
}
export default parseEntityJSONAndEmbed
