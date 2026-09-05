import type { Link } from "@phylopic/api-models"
import type { S3Client } from "@aws-sdk/client-s3"
import { getEntityJSONKey } from "@phylopic/s3-entities"
import { isDefined } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import getEntityFolderAndUUIDFromHRef from "./getEntityFolderAndUUIDFromHRef"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectEntitiesJSONFromLinks = async (client: S3Client, links: readonly Link[]): Promise<string> => {
    if (!links.length) {
        return "[]"
    }
    const foldersAndUUIDs = links.map(({ href }) => getEntityFolderAndUUIDFromHRef(href)).filter(isDefined)
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
        uuids.map(
            async uuid => (await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, folder, uuid))) ?? "null",
        ),
    )
    return `[${jsonList.join(",")}]`
}

export default selectEntitiesJSONFromLinks
