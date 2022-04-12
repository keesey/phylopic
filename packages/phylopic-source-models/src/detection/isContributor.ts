import { isTypeOrUndefined } from "phylopic-utils/src/detection"
import { isEmailAddress, isISOTimestamp, isNormalizedText } from "phylopic-utils/src/models"
import isObject from "phylopic-utils/src/models/detection/isObject"
import invalidate from "phylopic-utils/src/validation/invalidate"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Contributor } from "../types"
export const isContributor = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contributor =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Contributor).created, faultCollector?.sub("created")) &&
    isTypeOrUndefined((x as Contributor).emailAddress, isEmailAddress, faultCollector?.sub("emailAddress")) &&
    isNormalizedText((x as Contributor).name, faultCollector?.sub("name")) &&
    (typeof (x as Contributor).showEmailAddress === "boolean" ||
        invalidate(faultCollector?.sub("showEmailAddress"), "Expected true or false."))
export default isContributor
