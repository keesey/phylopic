import type { UUID } from "@phylopic/utils"
import type { DataParameters } from "./DataParameters"
import type { EmbeddableParameters } from "./EmbeddableParameters"
export type EntityParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        uuid: UUID
    }
