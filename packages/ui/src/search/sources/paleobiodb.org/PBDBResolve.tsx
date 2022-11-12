import { NodeWithEmbedded } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import React, { useMemo } from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import SearchContext from "../../context"
import PBDB_URL from "./PBDB_URL"
import { useDebounce } from "@react-hook/debounce"
import DEBOUNCE_WAIT from "../DEBOUNCE_WAIT"
import { createSearch } from "@phylopic/utils"
type PBDBRecord = Readonly<{
    ext: string
    nam: string
    noc: number
    oid: string
    par: string
    rid: string
    rnk: number
    vid: string
}>
type PBDBResponse = Readonly<{
    elapsed_time: number
    records: readonly PBDBRecord[]
}>
const fetchLineage: Fetcher<PBDBResponse, string> = async url => {
    const response = await fetchDataAndCheck<PBDBResponse>(url)
    return response.data
}
const fetchDirect: Fetcher<NodeWithEmbedded, string> = async url => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url)
    return response.data
}
const fetchIndirect: Fetcher<NodeWithEmbedded, [string, readonly number[]]> = async (url, objectIDs) => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, {
        data: objectIDs,
        method: "POST",
    })
    return response.data
}
const PBDBResolveObject: React.FC<{ oid: number }> = ({ oid }) => {
    const [, dispatch] = React.useContext(SearchContext) ?? []
    const [directKey, setDirectKey] = useDebounce<string | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setDirectKey(
                oid
                    ? `${process.env.NEXT_PUBLIC_API_URL}/resolve/paleobiodb.org/txn/${encodeURIComponent(
                          oid,
                      )}?embed_primaryImage=true`
                    : null,
            ),
        [oid, setDirectKey],
    )
    const direct = useSWRImmutable<NodeWithEmbedded>(directKey, fetchDirect)
    const lineageKey = useMemo(() => {
        return PBDB_URL + "/taxa/list.json" + createSearch({ id: "txn:" + oid, rel: "all_parents" })
    }, [oid])
    const lineage = useSWRImmutable(lineageKey, fetchLineage)
    const lineageOIDs = React.useMemo(() => {
        if (!lineage.data?.records) {
            return []
        }
        return lineage.data.records.map(({ oid }) => oid.replace(/^txn:/, "")).reverse()
    }, [lineage.data?.records])
    const [indirectKey, setIndirectKey] = useDebounce<[string, string[]] | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setIndirectKey(
                lineageOIDs.length
                    ? ([
                          `${process.env.NEXT_PUBLIC_API_URL}/resolve/paleobiodb.org/txn?embed_primaryImage=true`,
                          lineageOIDs,
                      ] as [string, string[]])
                    : null,
            ),
        [lineageOIDs, setIndirectKey],
    )
    const indirect = useSWRImmutable<NodeWithEmbedded>(indirectKey, fetchIndirect)
    React.useEffect(() => {
        const node = direct.data ?? indirect.data
        if (node && dispatch) {
            dispatch({
                type: "RESOLVE_EXTERNAL",
                payload: node,
                meta: { authority: "paleobiodb.org", namespace: "txn", objectID: String(oid) },
            })
        }
    }, [direct.data, dispatch, indirect.data, oid])
    return null
}
export const PBDBResolve: React.FC = () => {
    const [state] = React.useContext(SearchContext) ?? []
    const unresolvedOIDs = React.useMemo(() => {
        const oids = Object.keys(state?.externalResults["paleobiodb.org"]?.txn ?? {})
        return oids
            .filter(oid => !state?.resolutions["paleobiodb.org"]?.txn?.[oid])
            .map(oid => parseInt(oid, 10))
            .filter(isFinite)
            .sort()
    }, [state?.externalResults, state?.resolutions])
    return (
        <>
            {unresolvedOIDs.map(oid => (
                <PBDBResolveObject key={oid} oid={oid} />
            ))}
        </>
    )
}
export default PBDBResolve
