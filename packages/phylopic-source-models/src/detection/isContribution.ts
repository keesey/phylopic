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
import { Contribution } from "../types"
import isNodeIdentifier from "./isNodeIdentifier"
export const isContribution = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contribution =>
    ((typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")) &&
    isTypeOrUndefined((x as Contribution).attribution, isNormalizedText, faultCollector?.sub("attribution")) &&
    isEmailAddress((x as Contribution).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Contribution).created, faultCollector?.sub("created")) &&
    isTypeOrUndefined((x as Contribution).general, isNodeIdentifier, faultCollector?.sub("general")) &&
    isLicenseURL((x as Contribution).license, faultCollector?.sub("license")) &&
    isNodeIdentifier((x as Contribution).specific, faultCollector?.sub("specific")) &&
    isTypeOrUndefined((x as Contribution).sponsor, isNormalizedText, faultCollector?.sub("sponsor")) &&
    isUUID((x as Contribution).uuid, faultCollector?.sub("uuid")) &&
    Boolean(
        (x as Contribution).attribution ||
            isPublicDomainLicenseURL((x as Contribution).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isContribution
