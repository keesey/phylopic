import { normalizeText } from "../normalization/normalizeText"
export const isNormalizedText = (s: unknown): s is string =>
    typeof s === "string" && s.length > 0 && s === normalizeText(s)
