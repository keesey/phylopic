import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { normalizeText } from "../normalization/normalizeText"
export const isNormalizedText = (s: unknown, faultCollector?: ValidationFaultCollector): s is string =>
    (typeof s === "string" && s.length > 0 && s === normalizeText(s)) ||
    invalidate(faultCollector, "Expected normalized text.")