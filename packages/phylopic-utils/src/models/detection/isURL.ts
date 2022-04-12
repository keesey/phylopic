import { isNormalizedText } from "../../detection/"
import { invalidate, ValidationFaultCollector } from "../../validation"
import { URL } from "../types"
// :TODO: validate URL
export const isURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is URL =>
    isNormalizedText(x) || invalidate(faultCollector, "Not a valid URL.")
export default isURL
