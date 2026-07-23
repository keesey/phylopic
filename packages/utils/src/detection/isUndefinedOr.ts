import { type ValidationFaultCollector } from "../validation/ValidationFaultCollector"
import { FaultDetector } from "./FaultDetector"
export const isUndefinedOr =
    <T>(isType: FaultDetector<T>): FaultDetector<T | undefined> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is T | undefined =>
        x === undefined || isType(x, faultCollector)
