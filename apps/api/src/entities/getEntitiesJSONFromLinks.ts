import type { Link } from "@phylopic/api-models"
import type { S3Client } from "@aws-sdk/client-s3"
import { getEntityJSONKey } from "@phylopic/s3-entities"
import { isDefined } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import getFolderAndUUIDFromHRef from "./getFolderAndUUIDFromHRef"
import getS3EntityJSON from "./getS3EntityJSON"

const getEntitiesJSONFromLinks = async (client: S3Client, links: readonly Link[]): Promise<string> => {
    if (!links.length) {
        return "[]"
    }
    const foldersAndUUIDs = links.map(({ href }) => getFolderAndUUIDFromHRef(href)).filter(isDefined)
    const limit = foldersAndUUIDs.length
    if (limit !== links.length) {
        throw new Error("The query data for one or more links could not be determined.")
    }
    const folder = foldersAndUUIDs[0][0]
    if (!foldersAndUUIDs.every(([entryFolder]) => entryFolder === folder)) {
        throw new Error("All links must have the same entity type.")
    }
    const uuids = foldersAndUUIDs.map(([, uuid]) => uuid)
    const jsonList = await Promise.all(
        uuids.map(async uuid => (await getS3EntityJSON(client, getEntityJSONKey(BUILD, folder, uuid))) ?? "null"),
    )
    return `[${jsonList.join(",")}]`
}

export default getEntitiesJSONFromLinks
