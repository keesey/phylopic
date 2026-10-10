"use client"
import { type NodeWithEmbedded, isNodeWithEmbedded } from "@phylopic/api-models"
import { pbdbResolveObjectIDs } from "@phylopic/search"
import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { BuildContext } from "../../../builds"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"

const fetchNode: Fetcher<NodeWithEmbedded, string> = async url => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, undefined, isNodeWithEmbedded)
    return response.data
}

const PBDBResolveObject: React.FC<{ oid: string }> = ({ oid }) => {
    const [build] = React.useContext(BuildContext) ?? []
    const [, dispatch] = React.useContext(SearchContext) ?? []
    const lineage = useSWRImmutable(["pbdbResolveObjectIDs", oid] as const, ([, taxonOid]) =>
        pbdbResolveObjectIDs(taxonOid),
    )
    const lineageOIDs = React.useMemo(() => {
        if (lineage.isLoading) {
            return []
        }
        return lineage.data ?? [oid]
    }, [lineage.data, lineage.isLoading, oid])
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
                meta: { authority: "paleobiodb.org", namespace: "txn", objectID: oid },
            })
        }
    }, [dispatch, indirect.data, oid])
    return null
}

export const PBDBResolve: React.FC = () => {
    const [state] = React.useContext(SearchContext) ?? []
    const unresolvedOIDs = React.useMemo(() => {
        const oids = Object.keys(state?.externalResults["paleobiodb.org"]?.txn ?? {})
        return oids.filter(oid => !state?.resolutions["paleobiodb.org"]?.txn?.[oid]).sort()
    }, [state?.externalResults, state?.resolutions])
    return (
        <>
            {unresolvedOIDs.map(oid => (
                <PBDBResolveObject key={oid} oid={oid} />
            ))}
        </>
    )
}
