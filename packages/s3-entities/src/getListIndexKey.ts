import { encodeKeySegment } from "./encodeKeySegment"

export type ListName = "contributors" | "images" | "nodes"

export const getListIndexKey = (build: number, name: ListName) =>
    [build, "lists", name, "index"].map(encodeKeySegment).join("/") + ".json"
