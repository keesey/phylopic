import { S3Client } from "@aws-sdk/client-s3"
import BUILD from "../build/BUILD"
import { getEntityJSONKey } from "./getEntityJSONKey"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectEntityJSONFromHRef = async (client: S3Client, href: string): Promise<string> => {
    const tableAndUUID = getTableAndUUIDFromHRef(href)
    if (!tableAndUUID) {
        return "null"
    }
    const [table, uuid] = tableAndUUID
    return (await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, table, uuid))) ?? "null"
}

export default selectEntityJSONFromHRef
