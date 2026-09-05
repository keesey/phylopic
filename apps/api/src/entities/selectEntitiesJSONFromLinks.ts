import type { Link } from "@phylopic/api-models"
import type { S3Client } from "@aws-sdk/client-s3"
import { isDefined } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import { getEntityJSONKey } from "./getEntityJSONKey"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectEntitiesJSONFromLinks = async (client: S3Client, links: readonly Link[]): Promise<string> => {
    if (!links.length) {
        return "[]"
    }
    const tablesAndUUIDs = links.map(({ href }) => getTableAndUUIDFromHRef(href)).filter(isDefined)
    const limit = tablesAndUUIDs.length
    if (limit !== links.length) {
        throw new Error("The query data for one or more links could not be determined.")
    }
    const table = tablesAndUUIDs[0][0]
    if (!tablesAndUUIDs.every(([entryTable]) => entryTable === table)) {
        throw new Error("All links must have the same entity type.")
    }
    const uuids = tablesAndUUIDs.map(([, uuid]) => uuid)
    const jsonList = await Promise.all(
        uuids.map(
            async uuid => (await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, table, uuid))) ?? "null",
        ),
    )
    return `[${jsonList.join(",")}]`
}

export default selectEntitiesJSONFromLinks
