import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { encodeKeySegment } from "./encodeKeySegment"

export const getResolveJSONKey = (build: number, authority: Authority, namespace: Namespace, objectID: ObjectID) =>
    [build, "resolve", authority, namespace, objectID].map(encodeKeySegment).join("/") + ".json"
