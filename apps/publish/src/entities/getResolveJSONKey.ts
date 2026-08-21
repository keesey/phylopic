import { Authority, Namespace, ObjectID } from "@phylopic/utils"

export const getResolveJSONKey = (build: number, authority: Authority, namespace: Namespace, objectID: ObjectID) =>
    [build, "resolve", authority, namespace, objectID].map(value => encodeURIComponent(value)).join("/") + ".json"
