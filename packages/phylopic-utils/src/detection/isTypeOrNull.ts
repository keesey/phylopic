import { ValidationFaultCollector } from "../validation"
export const isTypeOrNull = <T>(
    x: unknown,
    isType: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T,
    faultCollector?: ValidationFaultCollector,
): x is T | null => x === null || isType(x, faultCollector)
export default isTypeOrNull
