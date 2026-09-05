import { UUID } from "@phylopic/utils"
import { encodeKeySegment } from "./encodeKeySegment"

export type EntityFolder = "contributors" | "images" | "nodes"

export const getEntityJSONKey = (build: number, folder: EntityFolder, uuid: UUID) =>
    [build, folder, uuid].map(encodeKeySegment).join("/") + ".json"
