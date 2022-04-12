import { S3Client } from "@aws-sdk/client-s3"
import type { Link, UUID } from "phylopic-api-models"
import { EmbeddableParameters } from "phylopic-api-models/dist/queryParameters/EmbeddableParameters"
import { EntityType } from "../entities/EntityType"
import getEmbedded from "./getEmbedded"
import readJSON from "./readJSON"
async function get<TEmbedded>(s3Client: S3Client, embeddableParameters: EmbeddableParameters<TEmbedded>, uuid: UUID, type: EntityType<TEmbedded>): Promise<string> {
    const json = await readJSON(
        s3Client,
        `${type.path}/${uuid}`,
        `Data for the specified ${type.userLabel} cannot be found.`,
        "data.phylopic.org",
    )
    let embedded = ""
    const embeds = Object.keys(embeddableParameters)
    if (embeds.length) {
        const embedKeys: readonly string[] = embeds.map(embed => embed.replace(/^embed_/, ""))
        const parsed = JSON.parse(json)
        const links: { [name: string]: Link[] | Link | null } = parsed._links
        const embedResults = await getEmbedded(embedKeys, links, type as EntityType<unknown>, s3Client)
        embedded = embedResults.join(",")
    }
    return `{"_embedded":{${embedded}},${json.slice(1)}`
}
export default get
