import { createSearch } from "@phylopic/utils"
import { FC, useContext, useEffect } from "react"
import { Fetcher } from "swr"
import useSWR from "swr/immutable"
import fetchDataAndCheck from "~/fetch/fetchDataAndCheck"
import SearchContext from "../context"
const URL = "https://eol.org/api/search/1.0.json"
interface EOLSearch {
    readonly itemsPerPage: number
    readonly results: readonly EOLSearchResult[]
    readonly startIndex: number
    readonly totalResults: number
}
interface EOLSearchResult {
    readonly content: string
    readonly id: number
    readonly link: URL
    readonly title: string
}
const fetcher: Fetcher<Readonly<[readonly EOLSearchResult[], string]>, [string, string]> = async (url, query) => {
    if (query.length < 2) {
        return [[], query]
    }
    const response = await fetchDataAndCheck<EOLSearch>(
        url +
            createSearch({
                key: process.env.NEXT_PUBLIC_EOL_API_KEY,
                q: query,
            }),
    )
    return [response.data.results, query]
}
const EOLSearch: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const response = useSWR(state?.text ? [URL, state.text] : null, fetcher)
    useEffect(() => {
        if (dispatch && response.data) {
            dispatch({
                type: "ADD_EXTERNAL_MATCHES",
                payload: response.data[0].map(({ title }) => title),
                meta: { basis: response.data[1] },
            })
            dispatch({
                type: "ADD_EXTERNAL_RESULTS",
                payload: response.data[0].reduce<Record<string, string>>(
                    (prev, { id, title }) => ({
                        ...prev,
                        [id]: title,
                    }),
                    {},
                ),
                meta: {
                    authority: "eol.org",
                    namespace: "pages",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
export default EOLSearch