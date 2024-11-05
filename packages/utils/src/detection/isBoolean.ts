import { invalidate } from "../validation/invalidate"
import { type ValidationFaultCollector } from "../validation/ValidationFaultCollector"
export const isBoolean = (x: unknown, faultCollector?: ValidationFaultCollector): x is boolean =>
    typeof x === "boolean" || invalidate(faultCollector, "Expected a Boolean value.")
