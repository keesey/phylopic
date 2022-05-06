import { NodeListParameters, NodeWithEmbedded, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, extractQueryString, parseQueryString, Query } from "@phylopic/utils"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWR from "swr/immutable"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
import { SetNodeResultsAction } from "../context/actions"
import getMatchingText from "../utils/getMatchingText"
export interface Props {
    maxResults?: number
}
const PhyloPicNodeSearch: FC<Props> = ({ maxResults = 24 }) => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const matchingText = useMemo(
        () => getMatchingText(state?.internalMatches, state?.text),
        [state?.internalMatches, state?.text],
    )
    const endpoint = useMemo(
        () =>
            matchingText
                ? process.env.NEXT_PUBLIC_API_URL +
                "/images" +
                createSearch({
                    embed_primaryImage: "true",
                    filter_name: matchingText,
                    page: "0",
                } as NodeListParameters & Query)
                : null,
        [matchingText, maxResults],
    )
    const fetcher = useAPIFetcher<PageWithEmbedded<NodeWithEmbedded>>()
    const key = useAPISWRKey(endpoint)
    const { data } = useSWR(key, fetcher)
    useEffect(() => {
        if (dispatch && data) {
            const parsedQuery = parseQueryString(extractQueryString(data._links.self.href))
            const basis = parsedQuery.filter_name ?? ""
            dispatch({ type: "SET_NODE_RESULTS", payload: data._embedded.items, meta: { basis } } as SetNodeResultsAction)
        }
    }, [data, dispatch])
    return null
}
export default PhyloPicNodeSearch
