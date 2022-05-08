import { QueryMatches } from "@phylopic/api-models"
import { createSearch, extractQueryString, parseQueryString } from "@phylopic/utils"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
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
    const response = useSWRImmutable(key, fetcher)
    useEffect(() => {
        if (dispatch && response.data) {
            const query = parseQueryString(extractQueryString(response.data._links.self.href))
            const basis = query.query ?? ""
            dispatch({ type: "SET_INTERNAL_MATCHES", payload: response.data.matches, meta: { basis } })
        }
    }, [dispatch, response.data])
    return null
}
export default PhyloPicAutocomplete
