import { S3Client } from "@aws-sdk/client-s3"
import type { Link } from "phylopic-api-types"
import { EntityType } from "../entities/EntityType"
import getEmbedded from "./getEmbedded"
import readJSON from "./readJSON"
async function get(s3Client: S3Client, embedParameters: , uuid: string, type: EntityType): Promise<string> {
    const json = await readJSON(
        s3Client,
        `${type.path}/${uuid}`,
        `Data for the specified ${type.userLabel} cannot be found.`,
        "data.phylopic.org",
    )
    let embedded = ""
    if (embed) {
        const parsed = JSON.parse(json)
        const links: { [name: string]: Link[] | Link | null } = parsed._links
        const embedResults = await getEmbedded(embed, links, type, s3Client)
        embedded = embedResults.join(",")
    }
    return `{"_embedded":{${embedded}},${json.slice(1)}`
}
export default get
