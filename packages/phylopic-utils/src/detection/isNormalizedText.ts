import { normalizeText } from "../normalization"
import { invalidate, ValidationFaultCollector } from "../validation"
export const isNormalizedText = (s: unknown, faultCollector?: ValidationFaultCollector): s is string =>
    (typeof s === "string" && s.length > 0 && s === normalizeText(s)) ||
    invalidate(faultCollector, "Expected normalized text.")
