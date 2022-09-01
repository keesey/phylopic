import {
    invalidate,
    isIdentifier,
    isISOTimestamp,
    isNormalizedText,
    isObject,
    isPublicDomainLicenseURL,
    isUndefinedOr,
    isUUIDv4,
    isValidLicenseURL,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { Submission } from "../types"
const isStatus = (x: unknown, faultCollector?: ValidationFaultCollector): x is "incomplete" | "submitted" => {
    if (x === "incomplete" || x === "submitted") {
        return true
    }
    faultCollector?.add('Expected "incomplete" or "submitted".')
    return false
}
export const isSubmission = (x: unknown, faultCollector?: ValidationFaultCollector): x is Submission =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isNormalizedText)((x as Submission).attribution, faultCollector?.sub("attribution")) &&
    isUUIDv4((x as Submission).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Submission).created, faultCollector?.sub("created")) &&
    isUndefinedOr(isIdentifier)((x as Submission).identifier, faultCollector?.sub("identifier")) &&
    isUndefinedOr(isValidLicenseURL)((x as Submission).license, faultCollector?.sub("license")) &&
    isUndefinedOr(isNormalizedText)((x as Submission).newTaxonName, faultCollector?.sub("newTaxonName")) &&
    isUndefinedOr(isNormalizedText)((x as Submission).sponsor, faultCollector?.sub("sponsor")) &&
    isStatus((x as Submission).status, faultCollector?.sub("status")) &&
    ((x as Submission).status === "incomplete" ||
        Boolean(
            (x as Submission).attribution ||
                !(x as Submission).license ||
                isPublicDomainLicenseURL((x as Submission).license) ||
                invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
        )) &&
    ((x as Submission).status === "incomplete" ||
        isIdentifier((x as Submission).identifier, faultCollector?.sub("identifier"))) &&
    ((x as Submission).status === "incomplete" ||
        isValidLicenseURL((x as Submission).license, faultCollector?.sub("license")))
export default isSubmission
