import normalizeText from "../normalization/normalizeText.js"
import invalidate from "../validation/invalidate.js"
import type ValidationFaultCollector from "../validation/ValidationFaultCollector.js"
export const isNormalizedText = (s: unknown, faultCollector?: ValidationFaultCollector): s is string =>
    (typeof s === "string" && s.length > 0 && s === normalizeText(s)) ||
    invalidate(faultCollector, "Expected normalized text.")
export default isNormalizedText
