import isInteger from "../types/isInteger"
import { invalidate, ValidationFaultCollector } from "../validation"
export const isPositiveInteger = (x: unknown, faultCollector?: ValidationFaultCollector): x is number =>
    (isInteger(x) && x > 0) || invalidate(faultCollector, "Expected a non-negative integer.")
export default isPositiveInteger
