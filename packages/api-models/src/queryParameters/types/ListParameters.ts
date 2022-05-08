import { DataParameters } from "./DataParameters.js"
import { EmbeddableParameters } from "./EmbeddableParameters.js"
export type ListParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        embed_items?: "true"
        page?: string
    }
