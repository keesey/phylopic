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
import { Contribution } from "../types"
import isNodeIdentifier from "./isNodeIdentifier"
export const isContribution = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contribution =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isNormalizedText)((x as Contribution).attribution, faultCollector?.sub("attribution")) &&
    isEmailAddress((x as Contribution).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Contribution).created, faultCollector?.sub("created")) &&
    isUndefinedOr(isNodeIdentifier)((x as Contribution).general, faultCollector?.sub("general")) &&
    isLicenseURL((x as Contribution).license, faultCollector?.sub("license")) &&
    isNodeIdentifier((x as Contribution).specific, faultCollector?.sub("specific")) &&
    isUndefinedOr(isNormalizedText)((x as Contribution).sponsor, faultCollector?.sub("sponsor")) &&
    isUUID((x as Contribution).uuid, faultCollector?.sub("uuid")) &&
    Boolean(
        (x as Contribution).attribution ||
            isPublicDomainLicenseURL((x as Contribution).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isContribution
