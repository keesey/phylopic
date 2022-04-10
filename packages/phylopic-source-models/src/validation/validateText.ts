import { normalizeText } from "../normalization/normalizeText"

export const validateText = (value: string, normalized?: boolean) => {
    if (!value || typeof value !== "string") {
        throw new Error("Missing text.")
    }
    if (normalized && value !== normalizeText(value)) {
        throw new Error("Text is not normalized.")
    }
}
