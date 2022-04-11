import {
    isEmailAddress,
    isISOTimestamp,
    isLicenseURL,
    isNormalizedText,
    isPublicDomainLicenseURL,
    isUUID,
} from "phylopic-utils/src/models"
import { Contribution, NodeIdentifier } from "../types"
import isNodeIdentifier from "./isNodeIdentifier"
const isNormalizedTextOrUndefined = (x: unknown): x is string | undefined => x === undefined || isNormalizedText(x)
const isNodeIdentiferOrUndefined = (x: unknown): x is NodeIdentifier | undefined =>
    x === undefined || isNodeIdentifier(x)
export const isContribution = (x: unknown): x is Contribution =>
    typeof x === "object" &&
    x !== null &&
    isNormalizedTextOrUndefined((x as Contribution).attribution) &&
    isEmailAddress((x as Contribution).contributor) &&
    isISOTimestamp((x as Contribution).created) &&
    isNodeIdentiferOrUndefined((x as Contribution).general) &&
    isLicenseURL((x as Contribution).license) &&
    isNodeIdentifier((x as Contribution).specific) &&
    isNormalizedTextOrUndefined((x as Contribution).sponsor) &&
    isUUID((x as Contribution).uuid) &&
    Boolean((x as Contribution).attribution || isPublicDomainLicenseURL((x as Contribution).license))
export default isContribution
