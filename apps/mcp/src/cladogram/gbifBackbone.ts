import { GBIF_API_URL } from "@phylopic/search"
import type { FetchFn } from "../client/PhyloPicClient.js"

const GBIF_BACKBONE_DATASET_KEY = "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c"

export type GbifSearchResult = Readonly<{
    canonicalName?: string
    vernacularNames?: readonly Readonly<{ vernacularName?: string; language?: string }>[]
}>

/** GBIF backbone `species/search`; network or HTTP failures yield no results. */
export const searchGbifBackbone = async (
    params: Readonly<Record<string, string>>,
    fetchFn: FetchFn = fetch,
): Promise<readonly GbifSearchResult[]> => {
    const url = new URL("species/search", GBIF_API_URL)
    for (const [key, value] of Object.entries({ ...params, datasetKey: GBIF_BACKBONE_DATASET_KEY })) {
        url.searchParams.set(key, value)
    }
    try {
        const response = await fetchFn(url.toString(), { headers: { Accept: "application/json" } })
        if (!response.ok) {
            return []
        }
        const { results } = (await response.json()) as { results?: readonly GbifSearchResult[] }
        return results ?? []
    } catch {
        return []
    }
}
