import isString from "phylopic-utils/src/types/isString"
import { invalidate, ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Arc } from "../types"
export const isArc = (x: unknown, faultCollector?: ValidationFaultCollector): x is Arc =>
    (Array.isArray(x) && x.length === 2 && x.every(isString)) ||
    invalidate(faultCollector, "Expected an array of two strings.")
export default isArc
