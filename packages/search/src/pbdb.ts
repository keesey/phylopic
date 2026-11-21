import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck, JSON_API_HEADERS } from "@phylopic/utils-api"
import { PBDB_API_URL } from "./constants.js"

type PBDBAutocompleteRecord = Readonly<{
    nam: string
    oid: string
}>

type PBDBAutocompleteResponse = Readonly<{
    records: readonly PBDBAutocompleteRecord[]
}>

type PBDBLineageRecord = Readonly<{
    oid: string
}>

type PBDBLineageResponse = Readonly<{
    records: readonly PBDBLineageRecord[]
}>

export type PBDBTaxonSuggestion = Readonly<{
    oid: string
    title: string
}>

const pbdbNumericOid = (oid: string) => oid.replace(/^txn:/, "")

export const suggestPbdbTaxa = async (query: string, limit = 10): Promise<readonly PBDBTaxonSuggestion[]> => {
    if (query.length < 2) {
        return []
    }
    const response = await fetchDataAndCheck<PBDBAutocompleteResponse>(
        PBDB_API_URL + "/taxa/auto.json" + createSearch({ limit, name: query }),
        { headers: JSON_API_HEADERS },
    )
    return response.data.records
        .map(({ nam, oid }) => ({ oid: pbdbNumericOid(oid), title: nam }))
        .filter(({ oid, title }) => oid.length > 0 && title.length > 0)
}

export const pbdbResolveObjectIDs = async (oid: string): Promise<readonly string[]> => {
    const response = await fetchDataAndCheck<PBDBLineageResponse>(
        PBDB_API_URL + "/taxa/list.json" + createSearch({ id: `txn:${oid}`, rel: "all_parents" }),
    )
    if (!response.data.records?.length) {
        return [oid]
    }
    return response.data.records.map(({ oid: recordOid }) => pbdbNumericOid(recordOid)).reverse()
}
