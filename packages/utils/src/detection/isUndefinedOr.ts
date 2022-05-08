import type ValidationFaultCollector from "../validation/ValidationFaultCollector.js"
import { FaultDetector } from "./FaultDetector.js"
export const isUndefinedOr =
    <T>(isType: FaultDetector<T>): FaultDetector<T | undefined> =>
        (x: unknown, faultCollector?: ValidationFaultCollector): x is T | undefined =>
            x === undefined || isType(x, faultCollector)
export default isUndefinedOr
