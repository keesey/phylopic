import type { NodeEmbedded } from "../../types/NodeWithEmbedded"
import type { EmbeddableParameters } from "../types/EmbeddableParameters"
export const NODE_EMBEDDED_PARAMETERS: ReadonlyArray<string & keyof EmbeddableParameters<NodeEmbedded>> = [
    "embed_childNodes",
    "embed_parentNode",
    "embed_primaryImage",
]
