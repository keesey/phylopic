import { ValidationFaultCollector } from "../validation"
export const isTypeOrUndefined = <T>(
    x: unknown,
    isType: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T,
    faultCollector?: ValidationFaultCollector,
): x is T | undefined => x === undefined || isType(x, faultCollector)
export default isTypeOrUndefined
