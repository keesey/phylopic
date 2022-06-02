import { FC, useContext, useEffect } from "react"
import { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import fetchDataAndCheck from "~/fetch/fetchDataAndCheck"
import SearchContext from "../context"
import OTOL_URL from "./OTOL_URL"
interface OTOLAutocompleteName {
    readonly is_higher: boolean
    readonly is_suppressed: boolean
    readonly ott_id: number
    readonly unique_name: string
}
const fetcher: Fetcher<Readonly<[readonly OTOLAutocompleteName[], string]>, [string, string]> = async (url, name) => {
    if (name.length < 2) {
        return [[], name]
    }
    const response = await fetchDataAndCheck<readonly OTOLAutocompleteName[]>(url, {
        body: JSON.stringify({ name }),
        headers: new Headers({ "content-type": "application/json" }),
        method: "POST",
    })
    return [response.data, name]
}
const sanitizeUniqueName = (name: string) => name.replace(/\s*\((genus|merged)\s+(in|with)[^)]+\)/gi, "")
const OTOLAutocompleteName: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const response = useSWRImmutable(state?.text ? [OTOL_URL + "/tnrs/autocomplete_name", state.text] : null, fetcher)
    useEffect(() => {
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
export default OTOLAutocompleteName
