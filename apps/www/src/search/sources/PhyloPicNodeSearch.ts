import { NodeListParameters, NodeWithEmbedded, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, extractQueryString, parseQueryString, Query } from "@phylopic/utils"
import { useDebounce } from "@react-hook/debounce"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
import { SetNodeResultsAction } from "../context/actions"
import getMatchingText from "../utils/getMatchingText"
import DEBOUNCE_WAIT from "./DEBOUNCE_WAIT"
const PhyloPicNodeSearch: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const matchingText = useMemo(
        () => getMatchingText(state?.internalMatches, state?.text),
        [state?.internalMatches, state?.text],
    )
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
    const fetcher = useAPIFetcher<PageWithEmbedded<NodeWithEmbedded>>()
    const key = useAPISWRKey(endpoint)
    const [debouncedKey, setDebouncedKey] = useDebounce<string | null>(key, DEBOUNCE_WAIT, true)
    useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const { data } = useSWRImmutable(debouncedKey, fetcher)
    useEffect(() => {
        if (dispatch && data) {
            const parsedQuery = parseQueryString(extractQueryString(data._links.self.href))
            const basis = parsedQuery.filter_name ?? ""
            dispatch({
                type: "SET_NODE_RESULTS",
                payload: data._embedded.items,
                meta: { basis },
            } as SetNodeResultsAction)
        }
    }, [data, dispatch])
    return null
}
export default PhyloPicNodeSearch
