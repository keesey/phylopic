import { encodeKeySegment } from "./encodeKeySegment"
import type { ListName } from "./getListIndexKey"

export const getListPageKey = (build: number, name: ListName, page: number) =>
    [build, "lists", name, "pages", page].map(encodeKeySegment).join("/") + ".json"
