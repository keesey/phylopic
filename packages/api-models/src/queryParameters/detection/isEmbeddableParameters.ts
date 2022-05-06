import { FaultDetector } from "@phylopic/utils/dist/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { invalidate } from "@phylopic/utils/dist/validation"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
export const isEmbeddableParameters =
    <TEmbedded>(
        parameters: ReadonlyArray<string & keyof EmbeddableParameters<TEmbedded>>,
    ): FaultDetector<EmbeddableParameters<TEmbedded>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is EmbeddableParameters<TEmbedded> => {
        if (typeof x !== "object" || x === null) {
            return invalidate(faultCollector, "Expected an object.")
        }
        const keys = new Set(Object.keys(x))
        for (const parameter of parameters) {
            if (keys.has(parameter)) {
                if ((x as EmbeddableParameters<TEmbedded>)[parameter] !== "true") {
                    return invalidate(faultCollector?.sub(parameter), 'Expected "true".')
                }
            }
        }
        return true
    }
export default isEmbeddableParameters
