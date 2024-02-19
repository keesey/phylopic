import invalidate from "../validation/invalidate"
import type ValidationFaultCollector from "../validation/ValidationFaultCollector"
export const isNonnegativeNumber = (x: unknown, faultCollector?: ValidationFaultCollector): x is number =>
    (typeof x === "number" && isFinite(x) && x >= 0) || invalidate(faultCollector, "Expected a non-negative number.")
export default isNonnegativeNumber
