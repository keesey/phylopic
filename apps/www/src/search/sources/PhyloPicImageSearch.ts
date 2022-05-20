import { ImageListParameters, ImageWithEmbedded, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, extractQueryString, parseQueryString, Query } from "@phylopic/utils"
import { useDebounce } from "@react-hook/debounce"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
import { SetImageResultsAction } from "../context/actions"
import getMatchingText from "../utils/getMatchingText"
import DEBOUNCE_WAIT from "./DEBOUNCE_WAIT"
const PhyloPicImageSearch: FC = () => {
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
                      embed_specificNode: "true",
                      filter_name: matchingText,
                      page: "0",
                  } as ImageListParameters & Query)
                : null,
        [matchingText],
    )
    const fetcher = useAPIFetcher<PageWithEmbedded<ImageWithEmbedded>>()
    const key = useAPISWRKey(endpoint)
    const [debouncedKey, setDebouncedKey] = useDebounce<string | null>(key, DEBOUNCE_WAIT, true)
    useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const { data } = useSWRImmutable(debouncedKey, fetcher)
    useEffect(() => {
        if (dispatch && data) {
            const parsedQuery = parseQueryString(extractQueryString(data._links.self.href))
            const basis = parsedQuery.filter_name ?? ""
            dispatch({
                payload: data._embedded.items,
                meta: { basis },
                type: "SET_IMAGE_RESULTS",
            } as SetImageResultsAction)
        }
    }, [data, dispatch])
    return null
}
export default PhyloPicImageSearch
