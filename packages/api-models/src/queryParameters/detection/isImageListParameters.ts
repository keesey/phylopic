import { isUUIDish, isUUIDv4, ValidationFaultCollector } from "@phylopic/utils"
import { invalidate, isDefined, isNormalizedText, isUndefinedOr, isUUID } from "@phylopic/utils"
import { ImageEmbedded } from "../../types/ImageWithEmbedded"
import { IMAGE_EMBEDDED_PARAMETERS } from "../constants/IMAGE_EMBEDDED_PARAMETERS"
import { ImageListParameters } from "../types/ImageListParameters"
import hasOnlyOne from "./hasOnlyOne"
import isListParameters from "./isListParameters"
const isBoolean = (x: unknown, collector?: ValidationFaultCollector): x is "true" | "false" => {
    if (x !== "true" && x !== "false") {
        return invalidate(collector, 'Expected a value of "true" or "false".')
    }
    return true
}
export const isImageListParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ImageListParameters =>
    isListParameters<ImageEmbedded>(IMAGE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUIDv4)((x as ImageListParameters).filter_clade, faultCollector?.sub("filter_clade")) &&
    isUndefinedOr(isUUIDish)((x as ImageListParameters).filter_collection, faultCollector?.sub("filter_collection")) &&
    isUndefinedOr(isUUIDv4)((x as ImageListParameters).filter_contributor, faultCollector?.sub("filter_contributor")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_by, faultCollector?.sub("filter_license_by")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_nc, faultCollector?.sub("filter_license_nc")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_sa, faultCollector?.sub("filter_license_sa")) &&
    isUndefinedOr(isNormalizedText)((x as ImageListParameters).filter_name, faultCollector?.sub("filter_name")) &&
    isUndefinedOr(isUUIDv4)((x as ImageListParameters).filter_node, faultCollector?.sub("filter_node")) &&
    hasOnlyOne<ImageListParameters>(
        x,
        ["filter_clade", "filter_collection", "filter_name", "filter_node"],
        faultCollector,
    )
export default isImageListParameters
