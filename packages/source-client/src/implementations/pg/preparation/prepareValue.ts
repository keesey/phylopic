import { prepareBoolean } from "./prepareBoolean"
import { prepareJSON } from "./prepareJSON"
export const prepareValue = (x: unknown, type: string): unknown => {
    if (typeof x === "boolean") {
        return prepareBoolean(x)
    } else if (Array.isArray(x) && type.endsWith("[]")) {
        return `{${x.map(value => prepareValue(value, type.replace(/\[\]$/, ""))).join(",")}}`
    } else if (x && typeof x === "object") {
        return prepareJSON(x)
    }
    return x
}
