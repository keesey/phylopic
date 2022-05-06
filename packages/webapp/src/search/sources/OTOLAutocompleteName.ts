import axios from "axios"
import { useContext, useEffect, FC } from "react"
import useSWR, { Fetcher } from "swr"
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
    const response = await axios.post<readonly OTOLAutocompleteName[]>(url, { name })
    return [response.data, name]
}
const OTOLAutocompleteName: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const response = useSWR(state?.text ? [OTOL_URL + "/tnrs/autocomplete_name", state.text] : null, fetcher)
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
                        [ott_id]: unique_name,
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
