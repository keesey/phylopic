import type { ValidationFaultCollector } from "@phylopic/utils"
import { invalidate } from "@phylopic/utils"
import { Sizes } from "../types/Sizes"
export const isSizes = (x: unknown, faultCollector?: ValidationFaultCollector): x is Sizes => {
    if (typeof x === "string") {
        const parts = x.split(/x/g)
        return (
            (parts.length === 2 && parts.map(part => parseFloat(part)).every(part => isFinite(part) && part > 0)) ||
            invalidate(faultCollector, "Expected a sizes string with format `WxH`.")
        )
    }
    return invalidate(faultCollector, "Expected a sizes string.")
}
export default isSizes
