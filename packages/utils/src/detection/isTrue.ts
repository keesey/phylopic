import { invalidate } from "../validation/invalidate"
import { type ValidationFaultCollector } from "../validation/ValidationFaultCollector"
export const isTrue = (x: unknown, faultCollector?: ValidationFaultCollector): x is true =>
    x === true || invalidate(faultCollector, "Expected true.")
