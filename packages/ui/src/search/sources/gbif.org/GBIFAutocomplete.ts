import { useDebounce } from "@react-hook/debounce"
import React from "react"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"
import { GBIF_URL } from "./GBIF_URL"
import { fetchNameUsagePage } from "./fetchNameUsagePage"
export const GBIFAutocomplete: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const key = React.useMemo(
        () => (state?.text ? ([GBIF_URL + "species/suggest", state.text] as const) : null),
        [state?.text],
    )
    const [debouncedKey, setDebouncedKey] = useDebounce<typeof key>(key, DEBOUNCE_WAIT)
    React.useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const response = useSWRImmutable(debouncedKey, fetchNameUsagePage)
    React.useEffect(() => {
        if (dispatch && response.data) {
            dispatch({
                type: "ADD_EXTERNAL_MATCHES",
                payload: response.data[0].map(species => species.canonicalName ?? species.scientificName ?? ""),
                meta: { basis: response.data[1] },
            })
            dispatch({
                type: "ADD_EXTERNAL_RESULTS",
                payload: response.data[0].reduce<Record<string, string>>(
                    (prev, { canonicalName, key, scientificName }) => ({
                        ...prev,
                        [String(key)]: canonicalName ?? scientificName ?? "",
                    }),
                    {},
                ),
                meta: {
                    authority: "gbif.org",
                    namespace: "species",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
