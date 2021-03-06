import { extractPath, isUUID, UUID } from "@phylopic/utils"
import { TableName } from "./TableName"
const TABLE_FOR_PATH: Readonly<Record<string, TableName | undefined>> = {
    contributors: "contributor",
    nodes: "node",
    images: "image",
}
const getTableAndUUIDFromHRef = (href: string) => {
    const parts = extractPath(href).split(/\//g).filter(Boolean)
    if (parts.length !== 2) {
        return null
    }
    const [path, uuid] = parts
    const table = TABLE_FOR_PATH[path]
    if (!table || !isUUID(uuid)) {
        return null
    }
    return [table, uuid] as Readonly<[TableName, UUID]>
}
export default getTableAndUUIDFromHRef
