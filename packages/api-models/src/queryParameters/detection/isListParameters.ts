import type { FaultDetector, ValidationFaultCollector } from "@phylopic/utils"
import { invalidate } from "@phylopic/utils"
import { ListParameters } from "../types"
import { EmbeddableParameters } from "../types/EmbeddableParameters"
import isDataParameters from "./isDataParameters"
import isEmbeddableParameters from "./isEmbeddableParameters"
export const isListParameters =
    <TEmbedded>(
        parameters: ReadonlyArray<string & keyof EmbeddableParameters<TEmbedded>>,
    ): FaultDetector<ListParameters<TEmbedded>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is ListParameters<TEmbedded> => {
        if (!isDataParameters(x, faultCollector)) {
            return false
        }
        if (!isEmbeddableParameters<TEmbedded>(parameters)(x, faultCollector)) {
            return false
        }
        const embed_items = (x as ListParameters<TEmbedded>).embed_items
        if (embed_items === undefined) {
            if (Object.keys(x).filter(key => key.startsWith("embed_")).length > 0) {
                return invalidate(
                    faultCollector,
                    "Cannot embed item properties unless `embed_items` is included as a parameter.",
                )
            }
        } else if (embed_items !== "true") {
            return invalidate(faultCollector, 'The `embed_items` parameter must be set to "true" if present.')
        }
        return true
    }
export default isListParameters
