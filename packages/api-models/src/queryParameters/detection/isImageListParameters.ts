import {
    invalidate,
    isISOTimestamp,
    isNormalizedText,
    isUndefinedOr,
    isUUIDish,
    isUUIDv4,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { ImageEmbedded } from "../../types/ImageWithEmbedded"
import { IMAGE_EMBEDDED_PARAMETERS } from "../constants/IMAGE_EMBEDDED_PARAMETERS"
import { ImageListParameters } from "../types/ImageListParameters"
import hasOnlyOne from "./hasOnlyOne"
import isListParameters from "./isListParameters"
import precedes from "./precedes"
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
    isUndefinedOr(isISOTimestamp)(
        (x as ImageListParameters).filter_created_after,
        faultCollector?.sub("filter_created_after"),
    ) &&
    isUndefinedOr(isISOTimestamp)(
        (x as ImageListParameters).filter_created_before,
        faultCollector?.sub("filter_created_before"),
    ) &&
    isUndefinedOr(isUUIDv4)((x as ImageListParameters).filter_contributor, faultCollector?.sub("filter_contributor")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_by, faultCollector?.sub("filter_license_by")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_nc, faultCollector?.sub("filter_license_nc")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).filter_license_sa, faultCollector?.sub("filter_license_sa")) &&
    isUndefinedOr(isISOTimestamp)(
        (x as ImageListParameters).filter_modified_after,
        faultCollector?.sub("filter_modified_after"),
    ) &&
    isUndefinedOr(isISOTimestamp)(
        (x as ImageListParameters).filter_modified_before,
        faultCollector?.sub("filter_modified_before"),
    ) &&
    isUndefinedOr(isISOTimestamp)(
        (x as ImageListParameters).filter_modifiedFile_after,
        faultCollector?.sub("filter_modifiedFile_after"),
    ) &&
    isUndefinedOr(isISOTimestamp)(
        (x as ImageListParameters).filter_modifiedFile_before,
        faultCollector?.sub("filter_modifiedFile_before"),
    ) &&
    isUndefinedOr(isNormalizedText)((x as ImageListParameters).filter_name, faultCollector?.sub("filter_name")) &&
    isUndefinedOr(isUUIDv4)((x as ImageListParameters).filter_node, faultCollector?.sub("filter_node")) &&
    hasOnlyOne<ImageListParameters>(
        x,
        [
            "filter_clade",
            "filter_collection",
            ["filter_created_after", "filter_created_before"],
            ["filter_modified_after", "filter_modified_before"],
            ["filter_modifiedFile_after", "filter_modifiedFile_before"],
            "filter_name",
            "filter_node",
        ],
        faultCollector,
    ) &&
    precedes(x as ImageListParameters, "filter_created_after", "filter_created_before", faultCollector) &&
    precedes(x as ImageListParameters, "filter_modified_after", "filter_modified_before", faultCollector) &&
    precedes(x as ImageListParameters, "filter_modifiedFile_after", "filter_modifiedFile_before", faultCollector)
export default isImageListParameters
