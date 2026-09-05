import { UUID } from "@phylopic/utils"
import { encodeKeySegment } from "./encodeKeySegment"

export const getLineagePageKey = (build: number, uuid: UUID, page: number) =>
    [build, "lineages", uuid, "pages", page].map(encodeKeySegment).join("/") + ".json"
