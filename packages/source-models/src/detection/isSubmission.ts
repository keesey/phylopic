import {
    invalidate,
    isBoolean,
    isHash,
    isIdentifier,
    isISOTimestamp,
    isNormalizedText,
    isNullOr,
    isObject,
    isPublicDomainLicenseURL,
    isUUIDv4,
    isValidLicenseURL,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { Submission } from "../types"
export const isSubmission = (x: unknown, faultCollector?: ValidationFaultCollector): x is Submission =>
    isObject(x, faultCollector) &&
    isNullOr(isNormalizedText)((x as Submission).attribution, faultCollector?.sub("attribution")) &&
    isUUIDv4((x as Submission).contributor, faultCollector?.sub("contributor")) &&
    isISOTimestamp((x as Submission).created, faultCollector?.sub("created")) &&
    isHash((x as Submission).file, faultCollector?.sub("file")) &&
    isNullOr(isIdentifier)((x as Submission).identifier, faultCollector?.sub("identifier")) &&
    isNullOr(isValidLicenseURL)((x as Submission).license, faultCollector?.sub("license")) &&
    isNullOr(isNormalizedText)((x as Submission).newTaxonName, faultCollector?.sub("newTaxonName")) &&
    isNullOr(isNormalizedText)((x as Submission).sponsor, faultCollector?.sub("sponsor")) &&
    isBoolean((x as Submission).submitted, faultCollector?.sub("submitted")) &&
    (!(x as Submission).submitted ||
        Boolean(
            (x as Submission).attribution ||
                !(x as Submission).license ||
                isPublicDomainLicenseURL((x as Submission).license) ||
                invalidate(faultCollector?.sub("attribution"), "The specified license requires attribution."),
        )) &&
    (!(x as Submission).submitted || isIdentifier((x as Submission).identifier, faultCollector?.sub("identifier"))) &&
    (!(x as Submission).submitted || isValidLicenseURL((x as Submission).license, faultCollector?.sub("license")))
export default isSubmission
