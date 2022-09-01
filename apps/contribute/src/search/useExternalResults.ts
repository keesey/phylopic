import { parseNomen } from "parse-nomen"
import { useMemo } from "react"
import { SearchEntry } from "./SearchEntry"
import useOTOLResults from "./useOTOLResults"
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
    return {
        ...otol,
        data: otol.data ? otolEntries : EMPTY,
    }
}
export default useExternalResults
