import { parseNomen } from "parse-nomen"
import { useMemo } from "react"
import { SearchEntry } from "./SearchEntry"
import useEOLResults from "./useEOLResults"
import useOTOLResults from "./useOTOLResults"
import usePhyloPicResults from "./usePhyloPicResults"
const EMPTY: readonly never[] = []
const useSearch = (text: string) => {
    const phyloPic = usePhyloPicResults(text)
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
    const phyloPicEntries = phyloPic.data ?? EMPTY
    const entry = useMemo<SearchEntry | undefined>(
        () => [...phyloPicEntries, ...otolEntries, ...eolEntries][0],
        [eolEntries, otolEntries, phyloPicEntries],
    )
    const data = Boolean(phyloPic.data && otol.data && eol.data)
    const error = phyloPic.error || otol.error || eol.error
    return {
        data: entry,
        error,
        pending: !data && !error && (phyloPic.isValidating || otol.isValidating || eol.isValidating),
    }
}
export default useSearch
