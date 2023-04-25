import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { DataParameters } from "./DataParameters"
import { EmbeddableParameters } from "./EmbeddableParameters"
export type ResolveObjectsParameters = DataParameters &
    EmbeddableParameters<NodeEmbedded> &
    Readonly<{
        authority: Authority
        namespace: Namespace
        objectIDs: ObjectID
    }>
