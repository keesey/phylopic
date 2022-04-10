import { normalizeText } from "../normalization/normalizeText"

export const isNormalizedText = (s: unknown): s is string =>
    typeof s === "string" && Boolean(s) && s === normalizeText(s)
