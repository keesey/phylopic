import { getEntityJSONKey as getEntityJSONKeyForFolder, EntityFolder } from "@phylopic/s3-entities"
import { UUID } from "@phylopic/utils"
import { TableName } from "./TableName"

const TABLE_TO_FOLDER: Record<TableName, EntityFolder> = {
    contributor: "contributors",
    image: "images",
    node: "nodes",
}

export const getEntityJSONKey = (build: number, tableName: TableName, uuid: UUID) =>
    getEntityJSONKeyForFolder(build, TABLE_TO_FOLDER[tableName], uuid)
