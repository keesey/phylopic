import { NodeListParameters, NodeWithEmbedded, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query } from "@phylopic/utils"
import { useDebounce } from "@react-hook/debounce"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
import { SetNodeResultsAction } from "../context/actions"
import useQueryFetcher, { QueryKey } from "../hooks/useQueryFetcher"
import getMatchingText from "../utils/getMatchingText"
import DEBOUNCE_WAIT from "./DEBOUNCE_WAIT"
const PhyloPicNodeSearch: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const basis = state?.text || undefined
    const matchingText = useMemo(() => getMatchingText(state?.internalMatches, basis), [state?.internalMatches, basis])
    const endpoint = useMemo(
        () =>
            matchingText
                ? process.env.NEXT_PUBLIC_API_URL +
                  "/nodes" +
                  createSearch({
                      embed_items: "true",
                      embed_primaryImage: "true",
                      filter_name: matchingText,
                      page: "0",
                  } as NodeListParameters & Query)
                : null,
        [matchingText],
    )
    const apiSWRKey = useAPISWRKey(endpoint)
    const key = useMemo(() => (apiSWRKey && basis ? ([apiSWRKey, basis] as QueryKey) : null), [apiSWRKey, basis])
    const [debouncedKey, setDebouncedKey] = useDebounce(key, DEBOUNCE_WAIT, true)
    useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const fetcher = useQueryFetcher<PageWithEmbedded<NodeWithEmbedded>>()
    const { data } = useSWRImmutable(debouncedKey, fetcher)
    useEffect(() => {
        if (dispatch && data?.[0] && data[1]) {
            dispatch({
                meta: { basis: data[1] },
                payload: data[0]._embedded.items,
                type: "SET_NODE_RESULTS",
            } as SetNodeResultsAction)
        }
    }, [data, dispatch])
    return null
}
export default PhyloPicNodeSearch
