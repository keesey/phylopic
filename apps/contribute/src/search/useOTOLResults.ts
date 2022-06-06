import axios from "axios"
import { useMemo } from "react"
import useSWR, { Fetcher } from "swr"
export interface OTOLAutocompleteName {
    readonly is_higher: boolean
    readonly is_suppressed: boolean
    readonly ott_id: number
    readonly unique_name: string
}
const fetcher: Fetcher<readonly OTOLAutocompleteName[], [string, string]> = async (url, name) => {
    const response = await axios.post<readonly OTOLAutocompleteName[]>(
        url,
        { name },
        {
            headers: {
                "content-type": "application/json",
            },
        },
    )
    return response.data
}
const useOTOLResults = (text: string) => {
    const key = useMemo(
        () => (text ? (["https://api.opentreeoflife.org/v3/tnrs/autocomplete_name", text] as [string, string]) : null),
        [text],
    )
    return useSWR(key, fetcher)
}
export default useOTOLResults
