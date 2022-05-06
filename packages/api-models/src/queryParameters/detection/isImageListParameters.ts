import { isNormalizedText, isUndefinedOr } from "@phylopic/utils/dist/detection"
import { isUUID } from "@phylopic/utils/dist/models/detection"
import { isDefined } from "@phylopic/utils/dist/types"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { invalidate } from "@phylopic/utils/dist/validation"
import { ImageEmbedded } from "../../types/ImageWithEmbedded"
import { IMAGE_EMBEDDED_PARAMETERS } from "../constants"
import { ImageListParameters } from "../types"
import isListParameters from "./isListParameters"
const isBoolean = (x: unknown, collector?: ValidationFaultCollector): x is "true" | "false" => {
    if (x !== "true" && x !== "false") {
        return invalidate(collector, 'Expected a value of "true" or "false".')
    }
    return true
}
const hasOnlyOne = (x: readonly unknown[], collector?: ValidationFaultCollector) => {
    const defined = x.filter(isDefined)
    if (defined.length > 1) {
        return invalidate(
            collector,
            'The following fields cannot be combined in the same query: "filter_clade", "filter_name", "filter_node".',
        )
    }
    return true
}
export const isImageListParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ImageListParameters =>
    isListParameters<ImageEmbedded>(IMAGE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUID)((x as ImageListParameters).filter_clade, faultCollector?.sub("filter_clade")) &&
    isUndefinedOr(isUUID)((x as ImageListParameters).filter_contributor, faultCollector?.sub("filter_contributor")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_by, faultCollector?.sub("filter_license_by")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_nc, faultCollector?.sub("filter_license_nc")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_sa, faultCollector?.sub("filter_license_sa")) &&
    isUndefinedOr(isNormalizedText)((x as ImageListParameters).filter_name, faultCollector?.sub("filter_name")) &&
    isUndefinedOr(isUUID)((x as ImageListParameters).filter_node, faultCollector?.sub("filter_node")) &&
    hasOnlyOne(
        [
            (x as ImageListParameters).filter_clade,
            (x as ImageListParameters).filter_name,
            (x as ImageListParameters).filter_node,
        ],
        faultCollector,
    )
export default isImageListParameters
