import { invalidate } from "../validation"
import type ValidationFaultCollector from "../validation/ValidationFaultCollector"
export const isObject = (x: unknown, faultCollector?: ValidationFaultCollector): x is NonNullable<object> =>
    (typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")
export default isObject
