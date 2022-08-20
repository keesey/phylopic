import { Identifier, stringifyNomen } from "@phylopic/utils"
import { useMemo } from "react"
import getIdentifier from "./getIdentifier"
import { SearchEntry } from "./SearchEntry"
import useExternalResults from "./useExternalResults"
import usePhyloPicResults from "./usePhyloPicResults"
const compareEntries = (a: SearchEntry, b: SearchEntry) => {
    const aIsPhyloPic = a.authority === "phylopic.org" ? 0 : 1
    const bIsPhyloPic = b.authority === "phylopic.org" ? 0 : 1
    if (aIsPhyloPic !== bIsPhyloPic) {
        return aIsPhyloPic - bIsPhyloPic
    }
    const aString = stringifyNomen(a.name)
    const bString = stringifyNomen(b.name)
    return aString < bString ? -1 : aString > bString ? 1 : 0
}
const prepareEntries = (entries: readonly SearchEntry[]) => {
    const map = entries.reduce<Record<Identifier, SearchEntry>>(
        (prev, entry) => ({
            ...prev,
            [getIdentifier(entry)]: entry,
        }),
        {},
    )
    return Object.values(map).sort(compareEntries)
}
const useSearch = (text: string) => {
    const phyloPic = usePhyloPicResults(text)
    const external = useExternalResults(text)
    const data = useMemo(
        () => prepareEntries([...(phyloPic.data ?? []), ...(external.data ?? [])]),
        [phyloPic.data, external.data],
    )
    const hasData = Boolean(phyloPic.data && external.data)
    const error = phyloPic.error || external.error
    const isValidating = phyloPic.isValidating || external.isValidating
    return {
        data,
        error,
        pending: !hasData && !error && isValidating,
    }
}
export default useSearch
