import { normalizeText } from "../normalization/normalizeText"
import { invalidate } from "../validation/invalidate"
import { type ValidationFaultCollector } from "../validation/ValidationFaultCollector"
export const isNormalizedText = (s: unknown, faultCollector?: ValidationFaultCollector): s is string =>
    (typeof s === "string" && s.length > 0 && s === normalizeText(s)) ||
    invalidate(faultCollector, "Expected normalized text.")
