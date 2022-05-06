import { UUID } from "@phylopic/utils/dist/models/types"
import { DataParameters } from "./DataParameters"
import { EmbeddableParameters } from "./EmbeddableParameters"
export type EntityParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        uuid: UUID
    }
