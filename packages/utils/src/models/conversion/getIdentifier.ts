import { Authority, Identifier, Namespace, ObjectID } from "../types"
export const getIdentifier = (authority: Authority, namespace: Namespace, objectID: ObjectID): Identifier =>
    [authority, namespace, objectID].map(x => encodeURIComponent(x)).join("/")
