import invalidate from "../validation/invalidate.js"
import type ValidationFaultCollector from "../validation/ValidationFaultCollector.js"
export const isObject = (x: unknown, faultCollector?: ValidationFaultCollector): x is NonNullable<object> =>
    (typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")
export default isObject
