import type { FetchFn } from "../client/PhyloPicClient.js"
import { normalizeTaxonLabel } from "../search/phylopicNameMatch.js"
import { searchGbifBackbone } from "./gbifBackbone.js"

/** First matching rule wins, so `-oid` is checked before `-id`. */
const GROUP_NAME_DERIVATIONS: readonly (readonly [RegExp, string])[] = [
    [/^([a-z]+)ines?$/, "inae"],
    [/^([a-z]+)oids?$/, "oidea"],
    [/^([a-z]+)ids?$/, "idae"],
    [/^([a-z]+)ins?$/, "ini"],
]

/** Group names built on the same stem, e.g. bovine → Bovinae, hominid → Hominidae, hominoid → Hominoidea. */
export const derivedGroupNames = (label: string): string[] => {
    const word = label.trim().toLowerCase()
    for (const [pattern, suffix] of GROUP_NAME_DERIVATIONS) {
        const stem = pattern.exec(word)?.[1]
        if (stem) {
            return [stem[0]!.toUpperCase() + stem.slice(1) + suffix]
        }
    }
    return []
}

export const isPossibleCommonName = (label: string) => {
    const trimmed = label.trim()
    return /^[A-Za-z][A-Za-z' -]*$/.test(trimmed) && trimmed.split(/\s+/).length <= 3
}

/**
 * Scientific names whose GBIF backbone record lists the label (or its singular or plural) as an English
 * common name, most-listed first.
 */
export const expandFromGbifVernacular = async (label: string, fetchFn?: FetchFn): Promise<string[]> => {
    const query = normalizeTaxonLabel(label)
    const forms = new Set([query, `${query}s`, query.replace(/s$/, "")])
    const results = await searchGbifBackbone({ q: label.trim(), qField: "VERNACULAR", limit: "20" }, fetchFn)
    const ranked = results
        .map(result => ({
            name: result.canonicalName ?? "",
            count: (result.vernacularNames ?? []).filter(
                ({ language, vernacularName }) =>
                    (!language || language === "eng") && forms.has(normalizeTaxonLabel(vernacularName ?? "")),
            ).length,
        }))
        .filter(({ name, count }) => name && count > 0)
        .sort((a, b) => b.count - a.count)
    return [...new Set(ranked.map(({ name }) => name))]
}
