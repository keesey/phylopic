import { FaultDetector } from "phylopic-utils/src/detection"
import { isUUID } from "phylopic-utils/src/models"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { EntityParameters } from "../types"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
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
