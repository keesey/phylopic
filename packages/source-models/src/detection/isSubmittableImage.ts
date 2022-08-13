import {
    invalidate,
    isBoolean,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isNullOr,
    isObject,
    isPublicDomainLicenseURL,
    isUUIDv4,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { Image } from "../types/Image"
export const isSubmittableImage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image =>
    isObject(x, faultCollector) &&
    isBoolean((x as Image).accepted, faultCollector?.sub("accepted")) &&
    isNullOr(isNormalizedText)((x as Image).attribution, faultCollector?.sub("attribution")) &&
    isUUIDv4((x as Image).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Image).created, faultCollector?.sub("created")) &&
    isNullOr(isUUIDv4)((x as Image).general, faultCollector?.sub("general")) &&
    isLicenseURL((x as Image).license, faultCollector?.sub("license")) &&
    isISOTimestamp((x as Image).modified, faultCollector?.sub("modified")) &&
    isUUIDv4((x as Image).specific, faultCollector?.sub("specific")) &&
    isNullOr(isNormalizedText)((x as Image).sponsor, faultCollector?.sub("sponsor")) &&
    isBoolean((x as Image).submitted, faultCollector?.sub("submitted")) &&
    Boolean(
        (x as Image).attribution ||
            isPublicDomainLicenseURL((x as Image).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isSubmittableImage
