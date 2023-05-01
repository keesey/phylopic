import React from "react"
import useSWRImmutable from "swr/immutable"
import SearchContext from "../../context"
import GBIF_URL from "./GBIF_URL"
import { fetchNameUsagePage } from "./fetchNameUsagePage"
export const GBIFAutocomplete: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const response = useSWRImmutable(
        state?.text ? [GBIF_URL + "species/suggest", state.text] : null,
        fetchNameUsagePage,
    )
    React.useEffect(() => {
        if (dispatch && response.data) {
            dispatch({
                type: "ADD_EXTERNAL_MATCHES",
                payload: response.data[0].map(
                    species => species.scientificName ?? species.canonicalName ?? "[Unnamed]",
                ),
                meta: { basis: response.data[1] },
            })
            dispatch({
                type: "ADD_EXTERNAL_RESULTS",
                payload: response.data[0].reduce<Record<string, string>>(
                    (prev, { canonicalName, key, scientificName }) => ({
                        ...prev,
                        [String(key)]: scientificName ?? canonicalName ?? "[Unnamed]",
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
