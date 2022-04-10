import { ISODateTime } from "../models/ISODateTime"
import { validateISODateTime } from "../validation/validateISODateTime"

export const isISODateTime = (value: unknown): value is ISODateTime => {
    if (typeof value !== "string") {
        return false
    }
    try {
        validateISODateTime(value)
    } catch {
        return false
    }
    return true
}
