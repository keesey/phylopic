import isNormalizedText from "../../detection/isNormalizedText"
import invalidate from "../../validation/invalidate"
import type { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { URL } from "../types/URL"
// :TODO: validate URL
export const isURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is URL =>
    isNormalizedText(x) || invalidate(faultCollector, "Not a valid URL.")
export default isURL
