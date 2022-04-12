import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
export const NODE_EMBEDDED_PARAMETERS: ReadonlyArray<string & keyof EmbeddableParameters<NodeEmbedded>> = [
    "embed_childNodes",
    "embed_parentNode",
    "embed_primaryImage",
]
export default NODE_EMBEDDED_PARAMETERS
