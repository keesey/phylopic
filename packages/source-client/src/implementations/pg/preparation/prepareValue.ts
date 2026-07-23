import { prepareBoolean } from "./prepareBoolean"
import { prepareJSON } from "./prepareJSON"
export const prepareValue = (x: any) => {
    if (typeof x === "boolean") {
        return prepareBoolean(x)
    } else if (x && typeof x === "object") {
        return prepareJSON(x)
    }
    return x
}
