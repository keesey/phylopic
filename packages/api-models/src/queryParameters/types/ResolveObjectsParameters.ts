import type { Authority, Namespace, ObjectIDs } from "@phylopic/utils"
import type { NodeEmbedded } from "../../types/NodeWithEmbedded"
import type { DataParameters } from "./DataParameters"
import type { EmbeddableParameters } from "./EmbeddableParameters"
export type ResolveObjectsParameters = DataParameters &
    EmbeddableParameters<NodeEmbedded> &
    Readonly<{
        authority: Authority
        namespace: Namespace
        objectIDs: ObjectIDs
    }>
