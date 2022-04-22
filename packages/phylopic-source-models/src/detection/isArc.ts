import { invalidate, isString, ValidationFaultCollector } from "phylopic-utils/src"
import { Arc } from "../types"
export const isArc = (x: unknown, faultCollector?: ValidationFaultCollector): x is Arc =>
    (Array.isArray(x) && x.length === 2 && x.every(isString)) ||
    invalidate(faultCollector, "Expected an array of two strings.")
export default isArc
