import { Tag } from "../types/Tag"
export const normalizeTag = (tag: string): Tag | null => {
    const normalized = tag
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "-")
        .replace(/\-+/g, "-")
        .replace(/[- ]+$/, "")
        .replace(/^[- ]+/, "")
    return normalized.length >= 2 ? normalized : null
}
