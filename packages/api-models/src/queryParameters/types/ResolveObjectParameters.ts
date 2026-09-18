import type { Authority, Namespace, ObjectID } from "@phylopic/utils"
import type { NodeEmbedded } from "../../types/NodeWithEmbedded"
import type { DataParameters } from "./DataParameters"
import type { EmbeddableParameters } from "./EmbeddableParameters"
export type ResolveObjectParameters = DataParameters &
    EmbeddableParameters<NodeEmbedded> &
    Readonly<{
        authority: Authority
        namespace: Namespace
        objectID: ObjectID
    }>
