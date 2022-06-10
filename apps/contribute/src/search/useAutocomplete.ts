import { normalizeQuery, QueryMatches } from "@phylopic/api-models"
import { compareStrings } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import fetchJSON from "~/swr/fetchJSON"
import useEOLResults from "./useEOLResults"
import useOTOLResults from "./useOTOLResults"
const getSortIndex = (value: string, query: string) => {
    if (typeof value !== "string") {
        return Number.MAX_SAFE_INTEGER
    }
    const index = value.indexOf(query)
    if (index < 0) {
        return Number.MAX_SAFE_INTEGER
    }
    return index
}
const useAutocomplete = (text: string): readonly string[] => {
    const normalized = useMemo(() => {
        const n = normalizeQuery(text)
        return n.length < 2 ? "" : n
    }, [text])
    const phyloPicKey = useMemo(
        () =>
            normalized
                ? `${process.env.NEXT_PUBLIC_API_URL}/autocomplete?query=${encodeURIComponent(normalized)}`
                : null,
        [normalized],
    )
    const phyloPic = useSWR<QueryMatches>(phyloPicKey, fetchJSON)
    const otol = useOTOLResults(normalized)
    const eol = useEOLResults(normalized)
    const all = useMemo(() => {
        const result = new Set<string>()
        if (eol.data) {
            eol.data.results.forEach(eolResult => result.add(normalizeQuery(eolResult.title)))
        }
        if (otol.data) {
            otol.data.forEach(otolName => result.add(normalizeQuery(otolName.unique_name)))
        }
        if (phyloPic.data) {
            phyloPic.data.matches.forEach(value => result.add(normalizeQuery(value)))
        }
        return result
    }, [eol.data, otol.data, phyloPic.data])
    return useMemo(
        () => Array.from(all).sort((a, b) => getSortIndex(text, a) - getSortIndex(text, b) || compareStrings(a, b)),
        [all, text],
    )
}
export default useAutocomplete
