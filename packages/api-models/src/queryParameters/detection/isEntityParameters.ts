import { FaultDetector } from "@phylopic/utils/dist/detection"
import { isUUID } from "@phylopic/utils/dist/models/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { EmbeddableParameters, EntityParameters } from "../types"
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
