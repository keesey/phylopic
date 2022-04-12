import {
    isEmailAddress,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isPublicDomainLicenseURL,
    isUUID,
} from "phylopic-utils/src/models"
import { isTypeOrUndefined } from "phylopic-utils/src/types"
import invalidate from "phylopic-utils/src/validation/invalidate"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Image } from "../types"
export const isImage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image =>
    ((typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")) &&
    isTypeOrUndefined((x as Image).attribution, isNormalizedText, faultCollector?.sub("attribution")) &&
    isEmailAddress((x as Image).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Image).created, faultCollector?.sub("created")) &&
    isTypeOrUndefined((x as Image).general, isUUID, faultCollector?.sub("general")) &&
    isLicenseURL((x as Image).license, faultCollector?.sub("license")) &&
    isUUID((x as Image).specific, faultCollector?.sub("specific")) &&
    isTypeOrUndefined((x as Image).sponsor, isNormalizedText, faultCollector?.sub("sponsor")) &&
    Boolean(
        (x as Image).attribution ||
            isPublicDomainLicenseURL((x as Image).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isImage
