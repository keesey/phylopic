import invalidate from "../validation/invalidate.js"
import type ValidationFaultCollector from "../validation/ValidationFaultCollector.js"
import isArray from "./isArray.js"
export const isNonemptyArray =
    <T>(isType: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T) =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is readonly T[] =>
        isArray(isType)(x, faultCollector) &&
        ((x as readonly unknown[]).length >= 1 || invalidate(faultCollector, "Expected a nonempty array."))
export default isNonemptyArray
