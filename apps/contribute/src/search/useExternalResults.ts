import { parseNomen } from "parse-nomen"
import { useMemo } from "react"
import { SearchEntry } from "./SearchEntry"
import useOTOLResults from "./useOTOLResults"
import useTranslatedResults from "./useTranslatedResults"
const EMPTY: readonly never[] = []
const useExternalResults = (text: string) => {
    const otol = useOTOLResults(text)
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
    const combined = useMemo(() => (otol.data ? [...otolEntries] : EMPTY), [otol.data, otolEntries])
    const translated = useTranslatedResults(combined)
    return {
        data: translated.data,
        error: otol.error || translated.error,
        isValidating: otol.isValidating || translated.isValidating,
    }
}
export default useExternalResults
