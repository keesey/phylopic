import { FaultDetector } from "phylopic-utils/src/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { ListParameters } from "../types"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
import isDataParameters from "./isDataParameters"
import isEmbeddableParameters from "./isEmbeddableParameters"
export const isListParameters =
    <TEmbedded>(
        parameters: ReadonlyArray<string & keyof EmbeddableParameters<TEmbedded>>,
    ): FaultDetector<ListParameters<TEmbedded>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is ListParameters<TEmbedded> =>
        isDataParameters(x, faultCollector) && isEmbeddableParameters<TEmbedded>(parameters)(x, faultCollector)
export default isListParameters
