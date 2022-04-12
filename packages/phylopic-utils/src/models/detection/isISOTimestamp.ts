import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { ISOTimestamp } from "../types/ISOTimestamp"
export const isISOTimestamp = (value: unknown, faultCollector?: ValidationFaultCollector): value is ISOTimestamp => {
    if (typeof value !== "string") {
        return invalidate(faultCollector, "Expected an ISO datetime string.")
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        return invalidate(faultCollector, "Expected an ISO datetime string with format `YYYY-MM-DDTHH:mm:ss.SSSZ`.")
    }
    const parts = value.split(/\D+/g).map(part => parseInt(part, 10))
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]))
    return date.toISOString() === value || invalidate(faultCollector, "Not a valid datetime.")
}
export default isISOTimestamp
