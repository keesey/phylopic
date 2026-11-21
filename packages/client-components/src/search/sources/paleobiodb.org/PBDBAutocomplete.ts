"use client"
import { suggestPbdbTaxa } from "@phylopic/search"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"

export type PBDBAutocompleteProps = {
    limit?: number
}

const createFetcher =
    (limit: number): Fetcher<Readonly<[Readonly<{ oid: string; title: string }[]>, string]>, string> =>
    async name =>
        [await suggestPbdbTaxa(name, limit), name]

export const PBDBAutocomplete: React.FC<PBDBAutocompleteProps> = ({ limit = 10 }) => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const { text } = state ?? {}
    const key = text && text.length >= 2 ? text : null
    const [debouncedKey, setDebouncedKey] = useDebounce<string | null>(key, DEBOUNCE_WAIT, true)
    React.useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const fetcher = React.useMemo(() => createFetcher(limit), [limit])
    const response = useSWRImmutable(debouncedKey, fetcher)
    React.useEffect(() => {
        if (dispatch && response.data) {
            dispatch({
                type: "ADD_EXTERNAL_MATCHES",
                payload: response.data[0].map(({ title }) => title),
                meta: { basis: response.data[1] },
            })
            dispatch({
                type: "ADD_EXTERNAL_RESULTS",
                payload: response.data[0].reduce<Record<string, string>>(
                    (prev, { oid, title }) => ({
                        ...prev,
                        [oid]: title,
                    }),
                    {},
                ),
                meta: {
                    authority: "paleobiodb.org",
                    namespace: "txn",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
