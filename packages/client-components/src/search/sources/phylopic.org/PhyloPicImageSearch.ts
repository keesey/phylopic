"use client"
import { ImageListParameters, ImageWithEmbedded, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query } from "@phylopic/utils"
import { useAPISWRKey } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"
import { SetImageResultsAction } from "../../context/actions"
import { useQueryFetcher, type QueryKey } from "../../hooks/useQueryFetcher"
import { getMatchingText } from "../getMatchingText"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"
export const PhyloPicImageSearch: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const basis = state?.text || undefined
    const matchingText = React.useMemo(
        () => getMatchingText(state?.internalMatches, basis),
        [state?.internalMatches, basis],
    )
    const endpoint = React.useMemo(
        () =>
            matchingText
                ? process.env.NEXT_PUBLIC_API_URL +
                  "/images" +
                  createSearch({
                      embed_specificNode: "true",
                      filter_name: matchingText,
                      page: "0",
                  } as ImageListParameters & Query)
                : null,
        [matchingText],
    )
    const apiSWRKey = useAPISWRKey(endpoint)
    const key = React.useMemo(() => (apiSWRKey && basis ? ([apiSWRKey, basis] as QueryKey) : null), [apiSWRKey, basis])
    const [debouncedKey, setDebouncedKey] = useDebounce(key, DEBOUNCE_WAIT, true)
    React.useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const fetcher = useQueryFetcher<PageWithEmbedded<ImageWithEmbedded>>()
    const { data } = useSWRImmutable(debouncedKey, fetcher)
    React.useEffect(() => {
        if (dispatch && data?.[0] && data[1]) {
            dispatch({
                meta: { basis: data[1] },
                payload: data[0]._embedded.items,
                type: "SET_IMAGE_RESULTS",
            } as SetImageResultsAction)
        }
    }, [data, dispatch])
    return null
}
