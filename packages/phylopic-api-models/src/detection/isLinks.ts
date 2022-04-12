import { isNormalizedText, isObject } from "phylopic-utils/src/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Links } from "../types"
import isLink from "./isLink"
export const isLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Links =>
    isObject(x, faultCollector) && isLink(isNormalizedText)((x as Links).self, faultCollector)
export default isLinks
