import { QueryMatches } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWR from "swr/immutable"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
const PhyloPicAutocomplete: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const { text } = state ?? {}
    const endpoint = useMemo(
        () =>
            text && text.length >= 2
                ? process.env.NEXT_PUBLIC_API_URL + "/autocomplete" + createSearch({ query: text })
                : null,
        [text],
    )
    const fetcher = useAPIFetcher<QueryMatches>()
    const key = useAPISWRKey(endpoint)
    const response = useSWR(key, fetcher)
    useEffect(() => {
        if (dispatch && response.data) {
            const basis = decodeURIComponent(response.data._links.self.href.split("=", 2)[1])
            dispatch({ type: "SET_INTERNAL_MATCHES", payload: response.data.matches, meta: { basis } })
        }
    }, [dispatch, response.data])
    return null
}
export default PhyloPicAutocomplete
