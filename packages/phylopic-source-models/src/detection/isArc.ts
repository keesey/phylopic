import isString from "phylopic-utils/src/types/isString"
import invalidate from "phylopic-utils/src/validation/invalidate"
import { ValidationFaultCollector } from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Arc } from "../types"
export const isArc = (x: unknown, faultCollector?: ValidationFaultCollector): x is Arc =>
    (Array.isArray(x) && x.length === 2 && x.every(isString)) ||
    invalidate(faultCollector, "Not a valid arc. Must be an array of two strings.")
export default isArc
