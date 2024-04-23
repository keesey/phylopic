"use client"
import { QueryMatches } from "@phylopic/api-models"
import { createSearch, extractQueryString, parseQueryString } from "@phylopic/utils"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"
import { useAPIFetcher, useAPISWRKey } from "../../../swr"
export const PhyloPicAutocomplete: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const { text } = state ?? {}
    const endpoint = React.useMemo(
        () =>
            text && text.length >= 2
                ? process.env.NEXT_PUBLIC_API_URL + "/autocomplete" + createSearch({ query: text })
                : null,
        [text],
    )
    const fetcher = useAPIFetcher<QueryMatches>()
    const key = useAPISWRKey(endpoint)
    const [debouncedKey, setDebouncedKey] = useDebounce<string | null>(key, DEBOUNCE_WAIT, true)
    React.useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const response = useSWRImmutable(debouncedKey, fetcher)
    console.debug({ text, endpoint, key, debouncedKey, data: response.data })
    React.useEffect(() => {
        if (dispatch && response.data) {
            const query = parseQueryString(extractQueryString(response.data._links.self.href))
            const basis = query.query
            if (basis) {
                dispatch({ type: "SET_INTERNAL_MATCHES", payload: response.data.matches, meta: { basis } })
            }
        }
    }, [dispatch, response.data])
    return null
}
