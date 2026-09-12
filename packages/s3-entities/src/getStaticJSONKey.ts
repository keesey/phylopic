import { encodeKeySegment } from "./encodeKeySegment"

export type StaticJSONName = "namespaces"

export const getStaticJSONKey = (build: number, name: StaticJSONName) =>
    [build, name].map(encodeKeySegment).join("/") + ".json"
