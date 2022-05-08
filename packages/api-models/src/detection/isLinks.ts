import type { ValidationFaultCollector } from "@phylopic/utils"
import { isNormalizedText, isObject } from "@phylopic/utils"
import { Links } from "../types/Links.js"
import isLink from "./isLink.js"
export const isLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Links =>
    isObject(x, faultCollector) && isLink(isNormalizedText)((x as Links).self, faultCollector)
export default isLinks
