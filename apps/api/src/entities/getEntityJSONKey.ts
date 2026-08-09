import { UUID } from "@phylopic/utils"
import { TableName } from "./TableName"
type EntityFolder = "contributors" | "images" | "nodes"
const TABLE_TO_FOLDER: Record<TableName, EntityFolder> = {
    contributor: "contributors",
    image: "images",
    node: "nodes",
}
export const getEntityJSONKey = (build: number, tableName: TableName, uuid: UUID) =>
    `${build}/${TABLE_TO_FOLDER[tableName]}/${uuid}.json`
