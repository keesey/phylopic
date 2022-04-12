import { invalidate } from "../../validation"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
export const isArray = <T>(
    x: unknown,
    isType: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T,
    faultCollector?: ValidationFaultCollector,
): x is readonly T[] =>
    (Array.isArray(x) || invalidate(faultCollector, "Expected an array.")) &&
    (x as readonly unknown[]).every((value, index) => isType(value, faultCollector?.sub(String(index))))
export default isArray
