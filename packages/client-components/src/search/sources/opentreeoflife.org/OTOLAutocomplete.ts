"use client"
import { suggestOtolTaxa } from "@phylopic/search"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"

const fetchOtolSuggestions: Fetcher<
    Readonly<[Readonly<{ ott_id: number; title: string }[]>, string]>,
    string
> = async name => [await suggestOtolTaxa(name), name]

export const OTOLAutocomplete: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const response = useSWRImmutable(state?.text && state.text.length >= 2 ? state.text : null, fetchOtolSuggestions)
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
                    (prev, { ott_id, title }) => ({
                        ...prev,
                        [String(ott_id)]: title,
                    }),
                    {},
                ),
                meta: {
                    authority: "opentreeoflife.org",
                    namespace: "taxonomy",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
