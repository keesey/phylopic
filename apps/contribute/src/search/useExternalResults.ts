import { parseNomen } from "parse-nomen"
import { useMemo } from "react"
import { SearchEntry } from "./SearchEntry"
import useEOLResults from "./useEOLResults"
import useOTOLResults from "./useOTOLResults"
import useTranslatedResults from "./useTranslatedResults"
const EMPTY: readonly never[] = []
const useExternalResults = (text: string) => {
    const otol = useOTOLResults(text)
    const eol = useEOLResults(text)
    const otolEntries = useMemo(
        () =>
            otol.data?.map<SearchEntry>(name => ({
                authority: "opentreeoflife.org",
                namespace: "taxonomy",
                objectID: name.ott_id.toString(10),
                name: parseNomen(name.unique_name),
            })) ?? EMPTY,
        [otol.data],
    )
    const eolEntries = useMemo(
        () =>
            eol.data?.results.map<SearchEntry>(result => ({
                authority: "eol.org",
                namespace: "pages",
                objectID: result.id.toString(10),
                name: parseNomen(result.title),
            })) ?? EMPTY,
        [eol.data],
    )
    const combined = useMemo(
        () => (eol.data && otol.data ? [...eolEntries, ...otolEntries] : EMPTY),
        [eol.data, eolEntries, otol.data, otolEntries],
    )
    const translated = useTranslatedResults(combined)
    console.debug({ translated })
    return {
        data: translated.data,
        error: otol.error || eol.error || translated.error,
        isValidating: otol.isValidating || eol.isValidating || translated.isValidating,
    }
}
export default useExternalResults
