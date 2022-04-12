import { ValidationFaultCollector } from "../validation"
import { FaultDetector } from "./FaultDetector"
export const isNullOr =
    <T>(isType: FaultDetector<T>): FaultDetector<T | null> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is T | null =>
        x === null || isType(x, faultCollector)
export default isNullOr
