import isInteger from "../types/isInteger.js"
import invalidate from "../validation/invalidate.js"
import type ValidationFaultCollector from "../validation/ValidationFaultCollector.js"
export const isNonnegativeInteger = (x: unknown, faultCollector?: ValidationFaultCollector): x is number =>
    (isInteger(x) && x >= 0) || invalidate(faultCollector, "Expected a non-negative integer.")
export default isNonnegativeInteger
