import { EntityParameters } from "."
import { Authority, Namespace, NodeEmbedded, ObjectID } from "../models"
export interface ResolveParameters extends EntityParameters<NodeEmbedded> {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
