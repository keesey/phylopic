import { isLink, Links } from "@phylopic/api-models"
import { isString } from "@phylopic/utils"
import APIError from "../errors/APIError"
import type { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import selectEntitiesJSONFromLinks from "./selectEntitiesJSONFromLinks"
import selectEntityJSONFromHRef from "./selectEntityJSONFromHRef"
const isLinkWithStringHRef = isLink(isString)
const selectEntityEmbeds = async <TLinks extends Links, TEmbeds extends string & keyof TLinks>(
    service: PgClientService & S3ClientService,
    links: TLinks,
    embeds: readonly TEmbeds[],
    typeUserLabel: string,
): Promise<string> => {
    const embedPromises = embeds.map(async (property): Promise<string> => {
        const propertyLink = links[property]
        const propertyJSON = `${JSON.stringify(property)}:`
        if (Array.isArray(propertyLink) && propertyLink.every(link => isLinkWithStringHRef(link))) {
            return propertyJSON + (await selectEntitiesJSONFromLinks(service, propertyLink))
        }
        if (isLinkWithStringHRef(propertyLink)) {
            return propertyJSON + (await selectEntityJSONFromHRef(service, propertyLink.href))
        }
        if (propertyLink === null) {
            return propertyJSON + "null"
        }
        throw new APIError(500, [
            {
                developerMessage: `Invalid embed property: ${propertyJSON}.`,
                field: `embed_${property}`,
                type: "DEFAULT_5XX",
                userMessage: `The ${typeUserLabel} data is improperly formed.`,
            },
        ])
    })
    return `{${(await Promise.all(embedPromises)).join(",")}}`
}
export default selectEntityEmbeds
