import { normalizeSync as normalizeDiacritics } from "normalize-diacritics"
export const normalizeQuery = (query: string) => {
    return normalizeDiacritics(query ?? "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^a-z -]+/g, " ")
        .trim()
        .replace(/\s+/g, " ")
}
export default normalizeQuery
