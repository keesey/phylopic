import { createSearch, isFiniteNumber } from "@phylopic/utils"
import { fetchDataAndCheck, JSON_API_HEADERS } from "@phylopic/utils-api"
import { GBIF_API_URL } from "./constants.js"

export type GBIFRank = "species" | "genus" | "family" | "order" | "class" | "phylum" | "kingdom"

export type GBIFNameUsage = Readonly<Partial<Record<GBIFRank, string>>> &
    Readonly<Partial<Record<`${GBIFRank}Key`, number>>> &
    Partial<
        Readonly<{
            canonicalName: string
            key: number
            rank: string
            scientificName: string
        }>
    >

export type GBIFSpeciesSuggestion = Readonly<{
    key: number
    title: string
}>

const GBIF_RANK_KEYS: ReadonlyArray<keyof GBIFNameUsage> = [
    "key",
    "speciesKey",
    "genusKey",
    "familyKey",
    "orderKey",
    "classKey",
    "phylumKey",
    "kingdomKey",
]

export const gbifObjectIDsFromNameUsage = (usage: GBIFNameUsage, fallbackKey: number): readonly string[] => {
    const ids = GBIF_RANK_KEYS.map(key => usage[key])
        .filter(value => isFiniteNumber(value))
        .filter((value, index, array) => !array.slice(0, index).includes(value))
        .map(value => String(value))
    return ids.length ? ids : [String(fallbackKey)]
}

export const suggestGbifSpecies = async (query: string, limit = 10): Promise<readonly GBIFSpeciesSuggestion[]> => {
    if (query.length < 2) {
        return []
    }
    const response = await fetchDataAndCheck<readonly GBIFNameUsage[]>(
        GBIF_API_URL + "species/suggest" + createSearch({ q: query, limit }),
        { headers: JSON_API_HEADERS },
    )
    return response.data
        .filter(species => isFiniteNumber(species.key))
        .map(species => ({
            key: species.key as number,
            title: species.canonicalName ?? species.scientificName ?? "",
        }))
        .filter(({ title }) => title.length > 0)
}

export const fetchGbifNameUsage = async (speciesKey: number): Promise<GBIFNameUsage | null> => {
    const response = await fetchDataAndCheck<GBIFNameUsage>(
        `${GBIF_API_URL}species/${encodeURIComponent(speciesKey)}`,
        { headers: JSON_API_HEADERS },
    )
    return response.data ?? null
}

export const gbifResolveObjectIDs = async (speciesKey: number): Promise<readonly string[]> => {
    const usage = await fetchGbifNameUsage(speciesKey)
    if (!usage) {
        return [String(speciesKey)]
    }
    return gbifObjectIDsFromNameUsage(usage, speciesKey)
}

/** SWR-compatible fetcher used by the PhyloPic web search UI. */
export const fetchGbifSpeciesSuggestPage = async (
    url: string,
    name: string,
): Promise<readonly [readonly GBIFNameUsage[], string]> => {
    if (name.length < 2) {
        return [[], name]
    }
    const response = await fetchDataAndCheck<readonly GBIFNameUsage[]>(url + createSearch({ q: name }), {
        headers: JSON_API_HEADERS,
    })
    return [response.data, name]
}
