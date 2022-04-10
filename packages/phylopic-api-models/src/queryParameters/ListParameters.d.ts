import { DataParameters } from "./DataParameters"
import { EmbeddableParameters } from "./EmbeddableParameters"
export type ListParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        page?: string
    }
