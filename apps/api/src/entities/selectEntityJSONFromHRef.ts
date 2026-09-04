import { S3Client } from "@aws-sdk/client-s3"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
import selectEntityJSON from "./selectEntityJSON"

const selectEntityJSONFromHRef = async (client: S3Client, href: string): Promise<string> => {
    const tableAndUUID = getTableAndUUIDFromHRef(href)
    if (!tableAndUUID) {
        return "null"
    }
    const [table, uuid] = tableAndUUID
    return await selectEntityJSON(client, table, uuid)
}

export default selectEntityJSONFromHRef
