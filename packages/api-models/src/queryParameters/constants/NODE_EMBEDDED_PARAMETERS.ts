import { NodeEmbedded } from "../../types/NodeWithEmbedded.js"
import { EmbeddableParameters } from "../types/EmbeddableParameters.js"
export const NODE_EMBEDDED_PARAMETERS: ReadonlyArray<string & keyof EmbeddableParameters<NodeEmbedded>> = [
    "embed_childNodes",
    "embed_parentNode",
    "embed_primaryImage",
]
export default NODE_EMBEDDED_PARAMETERS
