import { isObject, isNormalizedText } from "@phylopic/utils/dist/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { Links } from "../types"
import isLink from "./isLink"
export const isLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Links =>
    isObject(x, faultCollector) && isLink(isNormalizedText)((x as Links).self, faultCollector)
export default isLinks
