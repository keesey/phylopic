import type { ValidationFaultCollector } from "@phylopic/utils"
import { invalidate, isEmailAddress, isISOTimestamp, isNormalizedText, isNullOr, isObject } from "@phylopic/utils"
import { Contributor } from "../types/Contributor"
export const isContributor = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contributor =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Contributor).created, faultCollector?.sub("created")) &&
    isNullOr(isEmailAddress)((x as Contributor).emailAddress, faultCollector?.sub("emailAddress")) &&
    isISOTimestamp((x as Contributor).modified, faultCollector?.sub("modified")) &&
    isNormalizedText((x as Contributor).name, faultCollector?.sub("name")) &&
    (typeof (x as Contributor).showEmailAddress === "boolean" ||
        invalidate(faultCollector?.sub("showEmailAddress"), "Expected true or false."))
export default isContributor
