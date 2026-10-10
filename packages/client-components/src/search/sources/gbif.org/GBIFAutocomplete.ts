"use client"
import { suggestGbifSpecies } from "@phylopic/search"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"

const fetchGbifSuggestions: Fetcher<
    Readonly<[Readonly<{ key: number; title: string }[]>, string]>,
    string
> = async name => [await suggestGbifSpecies(name), name]

export const GBIFAutocomplete: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const response = useSWRImmutable(state?.text && state.text.length >= 2 ? state.text : null, fetchGbifSuggestions)
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
                    (prev, { key, title }) => ({
                        ...prev,
                        [String(key)]: title,
                    }),
                    {},
                ),
                meta: {
                    authority: "gbif.org",
                    namespace: "species",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
