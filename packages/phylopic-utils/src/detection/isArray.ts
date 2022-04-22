import { invalidate } from "../validation"
import { FaultDetector } from "./FaultDetector"
export const isArray =
    <T>(isType: FaultDetector<T>): FaultDetector<readonly T[]> =>
    (x, faultCollector): x is readonly T[] =>
        (Array.isArray(x) || invalidate(faultCollector, "Expected an array.")) &&
        (x as readonly unknown[]).every((value, index) => isType(value, faultCollector?.sub(String(index))))
export default isArray