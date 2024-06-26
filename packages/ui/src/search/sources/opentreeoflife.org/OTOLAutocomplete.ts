import { fetchDataAndCheck } from "@phylopic/utils-api"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"
import { OTOL_URL } from "./OTOL_URL"
interface OTOLAutocompleteName {
    readonly is_higher: boolean
    readonly is_suppressed: boolean
    readonly ott_id: number
    readonly unique_name: string
}
const fetcher: Fetcher<Readonly<[readonly OTOLAutocompleteName[], string]>, [string, string]> = async ([url, name]) => {
    if (name.length < 2) {
        return [[], name]
    }
    const response = await fetchDataAndCheck<readonly OTOLAutocompleteName[]>(url, {
        data: { name },
        headers: { "content-type": "application/json" },
        method: "POST",
    })
    return [response.data, name]
}
const sanitizeUniqueName = (name: string) => name.replace(/\s*\([a-z\s+(in|with)[^)]+\)/gi, "")
export const OTOLAutocomplete: React.FC = () => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const response = useSWRImmutable(state?.text ? [OTOL_URL + "/tnrs/autocomplete_name", state.text] : null, fetcher)
    React.useEffect(() => {
        if (dispatch && response.data) {
            dispatch({
                type: "ADD_EXTERNAL_MATCHES",
                payload: response.data[0].map(({ unique_name }) => unique_name),
                meta: { basis: response.data[1] },
            })
            dispatch({
                type: "ADD_EXTERNAL_RESULTS",
                payload: response.data[0].reduce<Record<string, string>>(
                    (prev, { ott_id, unique_name }) => ({
                        ...prev,
                        [ott_id]: sanitizeUniqueName(unique_name),
                    }),
                    {},
                ),
                meta: {
                    authority: "opentreeoflife.org",
                    namespace: "taxonomy",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
