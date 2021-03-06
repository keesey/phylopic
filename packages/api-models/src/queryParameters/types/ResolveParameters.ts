import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { EntityParameters } from "./EntityParameters"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
export interface ResolveParameters extends EntityParameters<NodeEmbedded> {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
