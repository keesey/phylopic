import type { ValidationFaultCollector } from "@phylopic/utils"
import {
    invalidate,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isNullOr,
    isObject,
    isPublicDomainLicenseURL,
    isUUID,
} from "@phylopic/utils"
import { Image } from "../types/Image.js"
export const isImage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image =>
    isObject(x, faultCollector) &&
    isNullOr(isNormalizedText)((x as Image).attribution, faultCollector?.sub("attribution")) &&
    isUUID((x as Image).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Image).created, faultCollector?.sub("created")) &&
    isNullOr(isUUID)((x as Image).general, faultCollector?.sub("general")) &&
    isLicenseURL((x as Image).license, faultCollector?.sub("license")) &&
    isUUID((x as Image).specific, faultCollector?.sub("specific")) &&
    isNullOr(isNormalizedText)((x as Image).sponsor, faultCollector?.sub("sponsor")) &&
    Boolean(
        (x as Image).attribution ||
            isPublicDomainLicenseURL((x as Image).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isImage
