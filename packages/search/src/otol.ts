import { fetchDataAndCheck, JSON_API_HEADERS } from "@phylopic/utils-api"
import { OTOL_API_URL } from "./constants.js"

interface OTOLAutocompleteName {
    readonly ott_id: number
    readonly unique_name: string
}

interface OTOLLineageItem {
    readonly ott_id: number
}

interface OTOLTaxonInfo {
    readonly lineage?: readonly OTOLLineageItem[]
}

export type OTOLTaxonSuggestion = Readonly<{
    ott_id: number
    title: string
}>

export const sanitizeOtolUniqueName = (name: string) => name.replace(/\s*\([a-z\s+(in|with)[^)]+\)/gi, "")

export const suggestOtolTaxa = async (query: string): Promise<readonly OTOLTaxonSuggestion[]> => {
    if (query.length < 2) {
        return []
    }
    const response = await fetchDataAndCheck<readonly OTOLAutocompleteName[]>(
        `${OTOL_API_URL}/tnrs/autocomplete_name`,
        {
            data: { name: query },
            headers: { "content-type": "application/json", ...JSON_API_HEADERS },
            method: "POST",
        },
    )
    return response.data
        .map(({ ott_id, unique_name }) => ({
            ott_id,
            title: sanitizeOtolUniqueName(unique_name),
        }))
        .filter(({ ott_id, title }) => Number.isFinite(ott_id) && title.length > 0)
}

export const otolResolveObjectIDs = async (ott_id: number): Promise<readonly string[]> => {
    const response = await fetchDataAndCheck<OTOLTaxonInfo>(`${OTOL_API_URL}/taxonomy/taxon_info`, {
        data: { include_lineage: true, ott_id },
        headers: { "content-type": "application/json" },
        method: "POST",
    })
    if (!response.data.lineage?.length) {
        return [String(ott_id)]
    }
    return [String(ott_id), ...response.data.lineage.map(({ ott_id: lineageID }) => String(lineageID))]
}
