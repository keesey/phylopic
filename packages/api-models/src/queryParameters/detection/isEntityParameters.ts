import { isUUID, type FaultDetector, type ValidationFaultCollector } from "@phylopic/utils"
import { type EmbeddableParameters } from "../types/EmbeddableParameters"
import { type EntityParameters } from "../types/EntityParameters"
import { isDataParameters } from "./isDataParameters"
import { isEmbeddableParameters } from "./isEmbeddableParameters"
export const isEntityParameters =
    <TEmbedded>(
        parameters: ReadonlyArray<string & keyof EmbeddableParameters<TEmbedded>>,
    ): FaultDetector<EntityParameters<TEmbedded>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is EntityParameters<TEmbedded> =>
        isDataParameters(x, faultCollector) &&
        isEmbeddableParameters<TEmbedded>(parameters)(x, faultCollector) &&
        isUUID((x as EntityParameters<TEmbedded>).uuid, faultCollector?.sub("uuid"))
