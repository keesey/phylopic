import { Authority, Namespace, ObjectID } from "@phylopic/utils/dist/models/types"
import { EntityParameters } from "."
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
export interface ResolveParameters extends EntityParameters<NodeEmbedded> {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
