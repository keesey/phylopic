import { Authority, Namespace, ObjectID } from "phylopic-utils/src/models/types"
import { EntityParameters } from "."
import { NodeEmbedded } from "../types"
export interface ResolveParameters extends EntityParameters<NodeEmbedded> {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
