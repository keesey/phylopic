import { isNodeIdentifier } from "@phylopic/source-models"
import type { ValidationFaultCollector } from "@phylopic/utils"
import {
    invalidate,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isNullOr,
    isObject,
    isPublicDomainLicenseURL,
} from "@phylopic/utils"
import { Submission } from "./Submission"
export const isSubmission = (x: unknown, faultCollector?: ValidationFaultCollector): x is Submission =>
    isObject(x, faultCollector) &&
    isNullOr(isNormalizedText)((x as Submission).attribution, faultCollector?.sub("attribution")) &&
    isISOTimestamp((x as Submission).created, faultCollector?.sub("created")) &&
    isNullOr(isNodeIdentifier)((x as Submission).general, faultCollector?.sub("general")) &&
    isLicenseURL((x as Submission).license, faultCollector?.sub("license")) &&
    isNodeIdentifier((x as Submission).specific, faultCollector?.sub("specific")) &&
    isNullOr(isNormalizedText)((x as Submission).sponsor, faultCollector?.sub("sponsor")) &&
    Boolean(
        (x as Submission).attribution ||
            isPublicDomainLicenseURL((x as Submission).license) ||
            invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
    )
export default isSubmission
