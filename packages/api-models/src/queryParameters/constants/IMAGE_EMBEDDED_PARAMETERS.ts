import { ImageEmbedded } from "../../types/ImageWithEmbedded.js"
import { EmbeddableParameters } from "../types/EmbeddableParameters.js"
export const IMAGE_EMBEDDED_PARAMETERS: ReadonlyArray<string & keyof EmbeddableParameters<ImageEmbedded>> = [
    "embed_contributor",
    "embed_generalNode",
    "embed_nodes",
    "embed_specificNode",
]
export default IMAGE_EMBEDDED_PARAMETERS
