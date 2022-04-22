import { ClientBase } from "pg"
import { Link } from "phylopic-api-models/src"
import { isDefined, UUID } from "phylopic-utils/src"
import BUILD from "../build/BUILD"
import QueryConfigBuilder from "../utils/postgres/QueryConfigBuilder"
import getTableAndUUIDFromHRef from "./getTableAndUUIDFromHRef"
const selectEntitiesJSONFromLinks = async (client: ClientBase, links: readonly Link[]): Promise<string> => {
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
    const builder = new QueryConfigBuilder(`SELECT json,uuid FROM ${table} WHERE build=$::bigint AND (`, [BUILD])
    uuids.forEach((uuid, index) => {
        if (index > 0) {
            builder.add("OR")
        }
        builder.add("uuid=$::uuid", [uuid])
    })
    builder.add(") LIMIT $::bigint", [limit])
    const response = await client.query<{ json: string; uuid: UUID }>(builder.build())
    const jsonList = uuids.map(uuid => response.rows.find(row => row.uuid === uuid)?.json ?? "null")
    return `[${jsonList.join(",")}]`
}
export default selectEntitiesJSONFromLinks
