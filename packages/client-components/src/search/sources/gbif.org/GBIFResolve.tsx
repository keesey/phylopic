"use client"
import { type NodeWithEmbedded, isNodeWithEmbedded } from "@phylopic/api-models"
import { gbifResolveObjectIDs } from "@phylopic/search"
import { type URL, createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { BuildContext } from "../../../builds"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"

const fetchNode: Fetcher<NodeWithEmbedded, URL> = async url => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, undefined, isNodeWithEmbedded)
    return response.data
}

const GBIFResolveObject: React.FC<{ id: number }> = ({ id }) => {
    const [build] = React.useContext(BuildContext) ?? []
    const [, dispatch] = React.useContext(SearchContext) ?? []
    const lineage = useSWRImmutable(["gbifResolveObjectIDs", id] as const, ([, speciesKey]) =>
        gbifResolveObjectIDs(speciesKey),
    )
    const lineageIDs = React.useMemo(() => {
        if (lineage.isLoading) {
            return []
        }
        return lineage.data ?? [String(id)]
    }, [id, lineage.data, lineage.isLoading])
    const [indirectKey, setIndirectKey] = useDebounce<string | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setIndirectKey(
                lineageIDs.length
                    ? `${process.env.NEXT_PUBLIC_API_URL}/resolve/gbif.org/species${createSearch({
                          build,
                          embed_primaryImage: true,
                          objectIDs: lineageIDs.join(","),
                      })}`
                    : null,
            ),
        [build, lineageIDs, setIndirectKey],
    )
    const indirect = useSWRImmutable<NodeWithEmbedded>(indirectKey, fetchNode)
    React.useEffect(() => {
        if (indirect.data && dispatch) {
            dispatch({
                type: "RESOLVE_EXTERNAL",
                payload: indirect.data,
                meta: { authority: "gbif.org", namespace: "species", objectID: String(id) },
            })
        }
    }, [dispatch, id, indirect.data])
    return null
}

export const GBIFResolve: React.FC = () => {
    const [state] = React.useContext(SearchContext) ?? []
    const unresolvedIDs = React.useMemo(() => {
        const ids = Object.keys(state?.externalResults["gbif.org"]?.species ?? {})
        return ids
            .filter(id => !state?.resolutions["gbif.org"]?.species?.[id])
            .map(id => parseInt(id, 10))
            .filter(id => Number.isFinite(id))
            .sort()
    }, [state?.externalResults, state?.resolutions])
    return (
        <>
            {unresolvedIDs.map(id => (
                <GBIFResolveObject key={id} id={id} />
            ))}
        </>
    )
}
