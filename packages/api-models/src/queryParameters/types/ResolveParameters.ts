import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { EntityParameters } from "./EntityParameters.js"
import { NodeEmbedded } from "../../types/NodeWithEmbedded.js"
export interface ResolveParameters extends EntityParameters<NodeEmbedded> {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
