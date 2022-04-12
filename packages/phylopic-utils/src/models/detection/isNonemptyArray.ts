import { invalidate } from "../../validation"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import isArray from "./isArray"
export const isNonemptyArray = <T>(
    x: unknown,
    isType: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T,
    faultCollector?: ValidationFaultCollector,
): x is readonly T[] =>
    isArray(x, isType, faultCollector) &&
    ((x as readonly unknown[]).length >= 1 || invalidate(faultCollector, "Expected a nonempty array."))
export default isNonemptyArray
