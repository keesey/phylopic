import type { S3ClientService } from "../services/S3ClientService"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
import selectEntityJSON from "./selectEntityJSON"

const selectEntityJSONFromHRef = async (service: S3ClientService, href: string): Promise<string> => {
    const tableAndUUID = getTableAndUUIDFromHRef(href)
    if (!tableAndUUID) {
        return "null"
    }
    const [table, uuid] = tableAndUUID
    return await selectEntityJSON(service, table, uuid)
}

export default selectEntityJSONFromHRef
