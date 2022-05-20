import { FaultDetector, isUUID, ValidationFaultCollector } from "@phylopic/utils"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
import { EntityParameters } from "../types/EntityParameters"
import isDataParameters from "./isDataParameters"
import isEmbeddableParameters from "./isEmbeddableParameters"
export const isEntityParameters =
    <TEmbedded>(
        parameters: ReadonlyArray<string & keyof EmbeddableParameters<TEmbedded>>,
    ): FaultDetector<EntityParameters<TEmbedded>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is EntityParameters<TEmbedded> =>
        isDataParameters(x, faultCollector) &&
        isEmbeddableParameters<TEmbedded>(parameters)(x, faultCollector) &&
        isUUID((x as EntityParameters<TEmbedded>).uuid, faultCollector?.sub("uuid"))
export default isEntityParameters
