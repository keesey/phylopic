import {
    invalidate,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isNullOr,
    isObject,
    isPublicDomainLicenseURL,
    isUndefinedOr,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { Submission } from "../types/Submission"
import isNodeIdentifier from "./isNodeIdentifier"
export const isSubmission = (x: unknown, faultCollector?: ValidationFaultCollector): x is Submission =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isNullOr(isNormalizedText))((x as Submission).attribution, faultCollector?.sub("attribution")) &&
    isUndefinedOr(isISOTimestamp)((x as Submission).created, faultCollector?.sub("created")) &&
    isUndefinedOr(isNullOr(isNodeIdentifier))((x as Submission).general, faultCollector?.sub("general")) &&
    isUndefinedOr(isLicenseURL)((x as Submission).license, faultCollector?.sub("license")) &&
    isUndefinedOr(isNodeIdentifier)((x as Submission).specific, faultCollector?.sub("specific")) &&
    isUndefinedOr(isNullOr(isNormalizedText))((x as Submission).sponsor, faultCollector?.sub("sponsor")) &&
    Boolean(
        (x as Submission).attribution !== null ||
            isPublicDomainLicenseURL((x as Submission).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isSubmission
