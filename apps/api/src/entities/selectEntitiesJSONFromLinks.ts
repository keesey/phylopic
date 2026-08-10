import { Link } from "@phylopic/api-models"
import { isDefined, UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
import selectEntityJSON from "./selectEntityJSON"
const selectEntitiesJSONFromLinks = async (
    client: ClientBase | undefined,
    links: readonly Link[],
): Promise<string> => {
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
    if (ENTITY_JSON_SOURCE !== "postgres") {
        const jsonList = await Promise.all(uuids.map(uuid => selectEntityJSON(client, table, uuid)))
        return `[${jsonList.join(",")}]`
    }
    const builder = new QueryConfigBuilder(`SELECT json,uuid FROM ${table} WHERE build=$::bigint AND (`, [BUILD])
    uuids.forEach((uuid, index) => {
        if (index > 0) {
            builder.add("OR")
        }
        builder.add("uuid=$::uuid", [uuid])
    })
    builder.add(") LIMIT $::bigint", [limit])
    const response = await client!.query<{ json: string; uuid: UUID }>(builder.build())
    const jsonList = uuids.map(uuid => response.rows.find(row => row.uuid === uuid)?.json ?? "null")
    return `[${jsonList.join(",")}]`
}
export default selectEntitiesJSONFromLinks
