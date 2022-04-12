import { Authority, Namespace, ObjectID } from "phylopic-utils/src/models/types"
import { NodeEmbedded } from "~/types/NodeWithEmbedded"
import { EntityParameters } from "."
export interface ResolveParameters extends EntityParameters<NodeEmbedded> {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
