"use client"
import { type NodeWithEmbedded, isNodeWithEmbedded } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { BuildContext } from "../../../builds"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"
import { PBDB_URL } from "./PBDB_URL"

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

const fetchNode: Fetcher<NodeWithEmbedded, string> = async url => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, undefined, isNodeWithEmbedded)
    return response.data
}

const PBDBResolveObject: React.FC<{ oid: number }> = ({ oid }) => {
    const [build] = React.useContext(BuildContext) ?? []
    const [, dispatch] = React.useContext(SearchContext) ?? []
    const lineageKey = React.useMemo(() => {
        return PBDB_URL + "/taxa/list.json" + createSearch({ id: "txn:" + oid, rel: "all_parents" })
    }, [oid])
    const lineage = useSWRImmutable(lineageKey, fetchLineage)
    const lineageOIDs = React.useMemo(() => {
        if (lineage.isLoading) {
            return []
        }
        if (!lineage.data?.records?.length) {
            return [String(oid)]
        }
        return lineage.data.records.map(({ oid }) => oid.replace(/^txn:/, "")).reverse()
    }, [lineage.data?.records, lineage.isLoading, oid])
    const [indirectKey, setIndirectKey] = useDebounce<string | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setIndirectKey(
                lineageOIDs.length
                    ? `${process.env.NEXT_PUBLIC_API_URL}/resolve/paleobiodb.org/txn${createSearch({
                          build,
                          embed_primaryImage: true,
                          objectIDs: lineageOIDs.join(","),
                      })}`
                    : null,
            ),
        [build, lineageOIDs, setIndirectKey],
    )
    const indirect = useSWRImmutable<NodeWithEmbedded>(indirectKey, fetchNode)
    React.useEffect(() => {
        if (indirect.data && dispatch) {
            dispatch({
                type: "RESOLVE_EXTERNAL",
                payload: indirect.data,
                meta: { authority: "paleobiodb.org", namespace: "txn", objectID: String(oid) },
            })
        }
    }, [dispatch, indirect.data, oid])
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
