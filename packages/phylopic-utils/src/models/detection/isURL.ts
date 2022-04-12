import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { URL } from "../types/URL"
import { isNormalizedText } from "./isNormalizedText"
// :TODO: validate URL
export const isURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is URL =>
    isNormalizedText(x) || invalidate(faultCollector, "Not a valid URL.")
export default isURL
