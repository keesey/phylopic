import { S3Client } from "@aws-sdk/client-s3"
import type { Link } from "phylopic-api-types"
import { EntityType } from "../entities/EntityType"
import APIError from "../errors/APIError"
import readJSON from "./readJSON"
const getLinkErrorMessage = (type: EntityType) =>
    `Certain data associated with the specified ${type.userLabel} cannot be found.`
const getEmbedded = async (
    embed: string,
    links: { [name: string]: Link[] | Link | null },
    type: EntityType,
    s3Client: S3Client,
): Promise<string[]> => {
    const embeddedProperties = embed.split(" ").sort()
    const embedPromises = embeddedProperties.map(async (property): Promise<string> => {
        const propertyLink = links[property]
        const propertyJSON = `"${property}":`
        if (Array.isArray(propertyLink)) {
            const embeds = await Promise.all(
                propertyLink.map(link =>
                    link?.href ? readJSON(s3Client, link.href, getLinkErrorMessage(type)) : null,
                ),
            )
            return `${propertyJSON}[${embeds.join(",")}]`
        }
        if (typeof propertyLink?.href === "string") {
            return propertyJSON + (await readJSON(s3Client, propertyLink.href, getLinkErrorMessage(type)))
        }
        if (propertyLink === null) {
            return propertyJSON + "null"
        }
        throw new APIError(400, [
            {
                developerMessage: `Invalid embed property for ${type.path}: ${propertyJSON}.`,
                field: "embed",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: `The request for ${type.userLabel} data is improperly formed.`,
            },
        ])
    })
    return await Promise.all(embedPromises)
}
export default getEmbedded
