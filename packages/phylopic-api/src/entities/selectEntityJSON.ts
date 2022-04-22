import { ClientBase } from "pg"
import { UUID } from "phylopic-utils/src"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
import { TableName } from "./TableName"
const selectEntityJSON = async (
    client: ClientBase,
    tableName: TableName,
    uuid: UUID,
    userMessage = "There was an error retrieving data.",
): Promise<string> => {
    try {
        const result = await client.query<{ json: string }>({
            text: `SELECT json FROM ${tableName} WHERE build=$::bigint AND uuid=$::uuid LIMIT 1`,
            values: [BUILD, uuid],
        })
        if (result.rows.length === 1) {
            return result.rows[0].json
        }
        return "null"
    } catch (e) {
        throw new APIError(500, [
            {
                developerMessage: `Error retrieving entity (UUID: ${uuid}) from table "${tableName}": ${e}`,
                type: "DEFAULT_5XX",
                userMessage,
            },
        ])
    }
}
export default selectEntityJSON
