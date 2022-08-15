import { useMemo } from "react"
import { SearchEntry } from "./SearchEntry"
import usePhyloPicResults from "./usePhyloPicResults"
const EMPTY: readonly never[] = []
const usePhyloPicSearch = (text: string) => {
    const phyloPic = usePhyloPicResults(text)
    const phyloPicEntries = phyloPic.data ?? EMPTY
    const entry = useMemo<SearchEntry | undefined>(() => phyloPicEntries[0], [phyloPicEntries])
    const data = Boolean(phyloPic.data)
    const error = phyloPic.error
    return {
        data: entry,
        error,
        pending: !data && !error && phyloPic.isValidating,
    }
}
export default usePhyloPicSearch
