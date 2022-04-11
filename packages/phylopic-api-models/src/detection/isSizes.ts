import { isPositiveInteger } from "phylopic-utils/src/types"
import { Sizes } from ".."
export const isSizes = (x: unknown): x is Sizes => {
    if (typeof x === "string") {
        const parts = x.split(/x/g)
        return parts.length === 2 && parts.map(part => parseInt(part, 10)).every(isPositiveInteger)
    }
    return false
}
export default isSizes
