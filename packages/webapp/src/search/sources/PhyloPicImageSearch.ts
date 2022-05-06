import { ImageWithEmbedded, List } from "@phylopic/api-models"
import { useContext, useEffect, useMemo, FC } from "react"
import useSWR from "swr"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
import getMatchingText from "../utils/getMatchingText"
export interface Props {
    maxResults?: number
}
const PhyloPicImageSearch: FC<Props> = ({ maxResults = 24 }) => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const matchingText = useMemo(
        () => getMatchingText(state?.internalMatches, state?.text),
        [state?.internalMatches, state?.text],
    )
    const href = useMemo(
        () =>
            matchingText
                ? `${process.env.NEXT_PUBLIC_API_URL}/images?embed=specificNode&length=${encodeURIComponent(
                      maxResults,
                  )}&name=${encodeURIComponent(matchingText)}& start=0`
                : null,
        [matchingText, maxResults],
    )
    const fetcher = useAPIFetcher<List<ImageWithEmbedded>>()
    const key = useAPISWRKey(href)
    const response = useSWR(key, fetcher)
    useEffect(() => {
        if (dispatch && response.data) {
            const basis = response.data._links.self.href
                .split("?", 2)[1]
                .split("&")
                .map(part => part.split("=").map(decodeURIComponent))
                .filter(([name]) => name === "name")[0][1]
            dispatch({ type: "SET_IMAGE_RESULTS", payload: response.data._embedded.items, meta: { basis } })
        }
    }, [dispatch, response.data, state?.text])
    return null
}
export default PhyloPicImageSearch
