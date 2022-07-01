import { isNodeIdentifier } from "@phylopic/source-models"
import {
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isNullOr,
    isObject,
    isUndefinedOr,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { Submission } from "./Submission"
export const isPartialSubmission = (x: unknown, faultCollector?: ValidationFaultCollector): x is Partial<Submission> =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isNullOr(isNormalizedText))(
        (x as Partial<Submission>).attribution,
        faultCollector?.sub("attribution"),
    ) &&
    isUndefinedOr(isISOTimestamp)((x as Partial<Submission>).created, faultCollector?.sub("created")) &&
    isUndefinedOr(isNullOr(isNodeIdentifier))((x as Partial<Submission>).general, faultCollector?.sub("general")) &&
    isUndefinedOr(isLicenseURL)((x as Partial<Submission>).license, faultCollector?.sub("license")) &&
    isUndefinedOr(isNodeIdentifier)((x as Partial<Submission>).specific, faultCollector?.sub("specific")) &&
    isUndefinedOr(isNullOr(isNormalizedText))((x as Partial<Submission>).sponsor, faultCollector?.sub("sponsor"))
export default isPartialSubmission
