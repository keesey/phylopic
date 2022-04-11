import {
    isEmailAddress,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isPublicDomainLicenseURL,
    isUUID,
    UUID,
} from "phylopic-utils/src/models"
import { Image } from "../types"
const isNormalizedTextOrUndefined = (x: unknown): x is string | undefined => x === undefined || isNormalizedText(x)
const isUUIDOrUndefined = (x: unknown): x is UUID | undefined => x === undefined || isUUID(x)
export const isImage = (x: unknown): x is Image =>
    typeof x === "object" &&
    x !== null &&
    isNormalizedTextOrUndefined((x as Image).attribution) &&
    isEmailAddress((x as Image).contributor) &&
    isISOTimestamp((x as Image).created) &&
    isUUIDOrUndefined((x as Image).general) &&
    isLicenseURL((x as Image).license) &&
    isUUID((x as Image).specific) &&
    isNormalizedTextOrUndefined((x as Image).sponsor) &&
    Boolean((x as Image).attribution || isPublicDomainLicenseURL((x as Image).license))
export default isImage
