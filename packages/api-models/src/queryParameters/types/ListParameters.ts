import { DataParameters } from "./DataParameters"
import { EmbeddableParameters } from "./EmbeddableParameters"
export type ListParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        embed_items?: "true"
        page?: string
    }
