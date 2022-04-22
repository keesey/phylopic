import {
    invalidate,
    isEmailAddress,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isObject,
    isPublicDomainLicenseURL,
    isUndefinedOr,
    isUUID,
    ValidationFaultCollector,
} from "phylopic-utils/src"
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
