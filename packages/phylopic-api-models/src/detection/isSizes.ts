import { isPositiveInteger } from "phylopic-utils/src/detection"
import { invalidate, ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Sizes } from ".."
export const isSizes = (x: unknown, faultCollector?: ValidationFaultCollector): x is Sizes => {
    if (typeof x === "string") {
        const parts = x.split(/x/g)
        return (
            (parts.length === 2 && parts.map(part => parseInt(part, 10)).every(part => isPositiveInteger(part))) ||
            invalidate(faultCollector, "Expected a sizes string with format `WxH`.")
        )
    }
    return invalidate(faultCollector, "Expected a sizes string.")
}
export default isSizes
