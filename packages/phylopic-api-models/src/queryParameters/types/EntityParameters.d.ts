import { UUID } from "phylopic-utils/src"
import { DataParameters } from "./DataParameters"
import { EmbeddableParameters } from "./EmbeddableParameters"
export type EntityParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        uuid: UUID
    }
