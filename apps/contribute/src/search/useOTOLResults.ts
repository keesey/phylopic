import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import fetchJSON from "~/fetch/fetchJSON"
export interface OTOLAutocompleteName {
    readonly is_higher: boolean
    readonly is_suppressed: boolean
    readonly ott_id: number
    readonly unique_name: string
}
const useOTOLResults = (name: string) => {
    const key = useMemo(
        () =>
            name.length >= 2
                ? {
                      data: { name },
                      method: "POST",
                      url: "https://api.opentreeoflife.org/v3/tnrs/autocomplete_name",
                  }
                : null,
        [name],
    )
    return useSWRImmutable<readonly OTOLAutocompleteName[]>(key, fetchJSON)
}
export default useOTOLResults
