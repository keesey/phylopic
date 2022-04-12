import { isNormalizedText, isObject, isUndefinedOr } from "phylopic-utils/src/detection"
import { isEmailAddress, isISOTimestamp } from "phylopic-utils/src/models/detection"
import { invalidate, ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Contributor } from "../types"
export const isContributor = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contributor =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Contributor).created, faultCollector?.sub("created")) &&
    isUndefinedOr(isEmailAddress)((x as Contributor).emailAddress, faultCollector?.sub("emailAddress")) &&
    isNormalizedText((x as Contributor).name, faultCollector?.sub("name")) &&
    (typeof (x as Contributor).showEmailAddress === "boolean" ||
        invalidate(faultCollector?.sub("showEmailAddress"), "Expected true or false."))
export default isContributor
