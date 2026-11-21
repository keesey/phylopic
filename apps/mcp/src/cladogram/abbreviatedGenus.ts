import type { FetchFn } from "../client/PhyloPicClient.js"
import { searchGbifBackbone } from "./gbifBackbone.js"

const ABBREVIATED_NAME_PATTERN = /^([A-Z])\.\s*([A-Za-z][A-Za-z-]*(?:\s+[A-Za-z][A-Za-z-]*)?)$/

export type AbbreviatedName = Readonly<{
    initial: string
    epithet: string
}>

/** Labels like `H. sapiens`, `G. Gorilla` or `G. gorilla gorilla`. */
export const parseAbbreviatedName = (label: string): AbbreviatedName | null => {
    const match = ABBREVIATED_NAME_PATTERN.exec(label.trim())
    return match ? { initial: match[1]!, epithet: match[2]!.replace(/\s+/g, " ").toLowerCase() } : null
}

const unique = (values: readonly string[]) => [...new Set(values)].sort()

/** Full names from genera in other labels, e.g. `P. paniscus` with `Pan troglodytes` gives `Pan paniscus`. */
export const expandFromContext = (name: AbbreviatedName, contextLabels: readonly string[]): string[] =>
    unique(
        contextLabels
            .map(label => label.trim().split(/\s+/)[0] ?? "")
            .filter(genus => /^[A-Z][a-z]+$/.test(genus) && genus.startsWith(name.initial)),
    ).map(genus => `${genus} ${name.epithet}`)

/** Full names from the GBIF backbone whose epithet matches and whose genus starts with the initial. */
export const expandFromGbif = async (name: AbbreviatedName, fetchFn?: FetchFn): Promise<string[]> => {
    const results = await searchGbifBackbone({ q: name.epithet, limit: "100" }, fetchFn)
    const pattern = new RegExp(`^${name.initial}[a-z]+ ${name.epithet}$`)
    return unique(results.map(result => result.canonicalName ?? "").filter(title => pattern.test(title)))
}
