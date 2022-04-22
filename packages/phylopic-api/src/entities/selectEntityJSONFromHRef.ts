import { ClientBase } from "pg"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
import selectEntityJSON from "./selectEntityJSON"
const selectEntityJSONFromHRef = async (client: ClientBase, href: string): Promise<string> => {
    const tableAndUUID = getTableAndUUIDFromHRef(href)
    if (!tableAndUUID) {
        return "null"
    }
    const [table, uuid] = tableAndUUID
    return await selectEntityJSON(client, table, uuid)
}
export default selectEntityJSONFromHRef
