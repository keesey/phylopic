import { isNormalizedText, isObject, isUndefinedOr } from "phylopic-utils/src/detection"
import {
    isEmailAddress,
    isISOTimestamp,
    isLicenseURL,
    isPublicDomainLicenseURL,
    isUUID,
} from "phylopic-utils/src/models"
import { invalidate, ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Image } from "../types"
export const isImage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isNormalizedText)((x as Image).attribution, faultCollector?.sub("attribution")) &&
    isEmailAddress((x as Image).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Image).created, faultCollector?.sub("created")) &&
    isUndefinedOr(isUUID)((x as Image).general, faultCollector?.sub("general")) &&
    isLicenseURL((x as Image).license, faultCollector?.sub("license")) &&
    isUUID((x as Image).specific, faultCollector?.sub("specific")) &&
    isUndefinedOr(isNormalizedText)((x as Image).sponsor, faultCollector?.sub("sponsor")) &&
    Boolean(
        (x as Image).attribution ||
            isPublicDomainLicenseURL((x as Image).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isImage
