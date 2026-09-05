import { UUID } from "@phylopic/utils"
import { encodeKeySegment } from "./encodeKeySegment"

export const getLineageIndexKey = (build: number, uuid: UUID) =>
    [build, "lineages", uuid, "index"].map(encodeKeySegment).join("/") + ".json"
