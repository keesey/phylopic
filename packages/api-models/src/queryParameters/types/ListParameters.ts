import type { DataParameters } from "./DataParameters"
import type { EmbeddableParameters } from "./EmbeddableParameters"

export type ListParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        embed_items?: "true"
        page?: string
    }
