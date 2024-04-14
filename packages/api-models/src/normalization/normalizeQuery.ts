import { normalizeSync } from "normalize-diacritics"
export const normalizeQuery = (query: string) => {
    return normalizeSync(query ?? "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^a-z -]+/g, " ")
        .trim()
        .replace(/\s+/g, " ")
}
