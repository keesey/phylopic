import isInteger from "../types/isInteger"
import { invalidate } from "../validation/invalidate"
import { ValidationFaultCollector } from "../validation/ValidationFaultCollector"
export const isNonnegativeInteger = (x: unknown, faultCollector?: ValidationFaultCollector): x is number =>
    (isInteger(x) && x >= 0) || invalidate(faultCollector, "Expected a non-negative integer.")
export default isNonnegativeInteger
