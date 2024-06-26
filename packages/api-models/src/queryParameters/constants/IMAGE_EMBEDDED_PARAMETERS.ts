import { ImageEmbedded } from "../../types/ImageWithEmbedded"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
export const IMAGE_EMBEDDED_PARAMETERS: ReadonlyArray<string & keyof EmbeddableParameters<ImageEmbedded>> = [
    "embed_contributor",
    "embed_generalNode",
    "embed_nodes",
    "embed_specificNode",
]
