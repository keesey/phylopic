import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { DataParameters } from "./DataParameters"
import { EmbeddableParameters } from "./EmbeddableParameters"
export type ResolveObjectParameters = DataParameters &
    EmbeddableParameters<NodeEmbedded> &
    Readonly<{
        authority: Authority
        namespace: Namespace
        objectID: ObjectID
    }>
