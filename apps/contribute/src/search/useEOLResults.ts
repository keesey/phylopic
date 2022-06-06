import { useMemo } from "react"
import useSWR from "swr"
import fetcher from "~/swr/fetcher"
export interface EOLSearch {
    readonly itemsPerPage: number
    readonly results: readonly EOLSearchResult[]
    readonly startIndex: number
    readonly totalResults: number
}
export interface EOLSearchResult {
    readonly content: string
    readonly id: number
    readonly link: URL
    readonly title: string
}
const useEOLResults = (text: string) => {
    const key = useMemo(
        () => (text ? `https://eol.org/api/search/1.0.json?q=${encodeURIComponent(text)}` : null),
        [text],
    )
    return useSWR<EOLSearch>(key, fetcher)
}
export default useEOLResults
