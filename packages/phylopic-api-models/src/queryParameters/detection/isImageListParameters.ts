import { isNormalizedText, isUndefinedOr } from "phylopic-utils/src/detection"
import { isUUID } from "phylopic-utils/src/models/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { ImageEmbedded } from "../../types/ImageWithEmbedded"
import { IMAGE_EMBEDDED_PARAMETERS } from "../constants"
import { ImageListParameters } from "../types"
import isListParameters from "./isListParameters"
const isBoolean = (x: unknown): x is "true" | "false" => x === "true" || x === "false"
export const isImageListParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ImageListParameters =>
    isListParameters<ImageEmbedded>(IMAGE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUID)((x as ImageListParameters).clade, faultCollector?.sub("clade")) &&
    isUndefinedOr(isUUID)((x as ImageListParameters).contributor, faultCollector?.sub("contributor")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).license_by, faultCollector?.sub("license_by")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).license_nc, faultCollector?.sub("license_nc")) &&
    isUndefinedOr(isBoolean)((x as ImageListParameters).license_sa, faultCollector?.sub("license_sa")) &&
    isUndefinedOr(isNormalizedText)((x as ImageListParameters).name, faultCollector?.sub("name")) &&
    isUndefinedOr(isUUID)((x as ImageListParameters).node, faultCollector?.sub("node"))
export default isImageListParameters
