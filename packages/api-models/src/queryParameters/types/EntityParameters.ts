import { UUID } from "@phylopic/utils"
import { DataParameters } from "./DataParameters.js"
import { EmbeddableParameters } from "./EmbeddableParameters.js"
export type EntityParameters<TEmbedded> = DataParameters &
    EmbeddableParameters<TEmbedded> & {
        uuid: UUID
    }
