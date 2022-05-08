import isNormalizedText from "../../detection/isNormalizedText.js"
import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import { URL } from "../types/URL.js"
// :TODO: validate URL
export const isURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is URL =>
    isNormalizedText(x) || invalidate(faultCollector, "Not a valid URL.")
export default isURL
