import { QueryMatches } from "@phylopic/api-models"
import { useContext, useEffect, useMemo, FC } from "react"
import useSWR from "swr"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
import useAPISWRKey from "~/swr/api/useAPISWRKey"
import SearchContext from "../context"
const PhyloPicAutocomplete: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const href = useMemo(
        () =>
            state?.text
                ? `${process.env.NEXT_PUBLIC_API_URL}/autocomplete?query=${encodeURIComponent(state.text)}`
                : null,
        [state?.text],
    )
    const fetcher = useAPIFetcher<QueryMatches>()
    const key = useAPISWRKey(href)
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
