import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import SearchContext from "../../context"
import DEBOUNCE_WAIT from "../DEBOUNCE_WAIT"
import PBDB_URL from "./PBDB_URL"
export type PBDBAutocompleteProps = {
    limit?: number
}
type PBDBRecord = Readonly<{
    nam: string
    noc: string
    oid: string
    rnk: string
    typ: "txn"
}>
type PBDBResponse = Readonly<{
    elapsed_time: number
    records: readonly PBDBRecord[]
}>
const fetcher: Fetcher<Readonly<[readonly PBDBRecord[], string]>, [string, string]> = async ([url, name]) => {
    if (name.length < 2) {
        return [[], name]
    }
    const response = await fetchDataAndCheck<PBDBResponse>(url)
    return [response.data.records, name]
}
export const PBDBAutocomplete: React.FC<PBDBAutocompleteProps> = ({ limit = 10 }) => {
    const [state, dispatch] = React.useContext(SearchContext) ?? []
    const { text } = state ?? {}
    const key = React.useMemo<[string, string] | null>(
        () =>
            text && text.length >= 2
                ? [PBDB_URL + "/taxa/auto.json" + createSearch({ limit, name: text }), text]
                : null,
        [text],
    )
    const [debouncedKey, setDebouncedKey] = useDebounce<[string, string] | null>(key, DEBOUNCE_WAIT, true)
    React.useEffect(() => setDebouncedKey(key), [key, setDebouncedKey])
    const response = useSWRImmutable(debouncedKey, fetcher)
    React.useEffect(() => {
        if (dispatch && response.data) {
            dispatch({
                type: "ADD_EXTERNAL_MATCHES",
                payload: response.data[0].map(({ nam }) => nam),
                meta: { basis: response.data[1] },
            })
            dispatch({
                type: "ADD_EXTERNAL_RESULTS",
                payload: response.data[0].reduce<Record<string, string>>(
                    (prev, { nam, oid }) => ({
                        ...prev,
                        [oid]: nam,
                    }),
                    {},
                ),
                meta: {
                    authority: "paleobiodb.org",
                    namespace: "txn",
                    basis: response.data[1],
                },
            })
        }
    }, [dispatch, response.data])
    return null
}
export default PBDBAutocomplete
