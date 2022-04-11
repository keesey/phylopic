import { EmailAddress, isEmailAddress, isISOTimestamp, isNormalizedText } from "phylopic-utils/src/models"
import { Contributor } from "../types"
const isEmailAddressOrUndefined = (x: unknown): x is EmailAddress | undefined => x === undefined || isEmailAddress(x)
export const isContributor = (x: unknown): x is Contributor =>
    typeof x === "object" &&
    x !== null &&
    isISOTimestamp((x as Contributor).created) &&
    isEmailAddressOrUndefined((x as Contributor).emailAddress) &&
    isNormalizedText((x as Contributor).name) &&
    typeof (x as Contributor).showEmailAddress === "boolean"
export default isContributor
