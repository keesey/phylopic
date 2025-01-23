import { prepareBoolean } from "./prepareBoolean"
import { prepareJSON } from "./prepareJSON"
export const prepareValue = (x: unknown): unknown => {
    if (typeof x === "boolean") {
        return prepareBoolean(x)
    } else if (Array.isArray(x)) {
        return `{${x.map(value => prepareValue(value)).join(",")}}`
    } else if (x && typeof x === "object") {
        return prepareJSON(x)
    }
    return x
}
