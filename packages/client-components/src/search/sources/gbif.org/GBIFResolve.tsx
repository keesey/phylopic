"use client"
import { NodeWithEmbedded, isNodeWithEmbedded } from "@phylopic/api-models"
import { URL, createSearch, isFiniteNumber } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import { SearchContext } from "../../context"
import { DEBOUNCE_WAIT } from "../DEBOUNCE_WAIT"
import { GBIF_URL } from "./GBIF_URL"
import { fetchNameUsage } from "./fetchNameUsage"
import { GBIFNameUsage } from "./GBIFNameUsage"
import { BuildContext } from "../../../builds"
const GBIF_RANK_KEYS: ReadonlyArray<keyof GBIFNameUsage> = [
    "key",
    "speciesKey",
    "genusKey",
    "familyKey",
    "orderKey",
    "classKey",
    "phylumKey",
    "kingdomKey",
]
const fetchNode: Fetcher<NodeWithEmbedded, URL> = async url => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, undefined, isNodeWithEmbedded)
    return response.data
}
const GBIFResolveObject: React.FC<{ id: number }> = ({ id }) => {
    const [build] = React.useContext(BuildContext) ?? []
    const [, dispatch] = React.useContext(SearchContext) ?? []
    const [directKey, setDirectKey] = useDebounce<string | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setDirectKey(
                id
                    ? `${process.env.NEXT_PUBLIC_API_URL}/resolve/gbif.org/species/${encodeURIComponent(
                          id,
                      )}${createSearch({
                          build,
                          embed_primaryImage: true,
                      })}`
                    : null,
            ),
        [build, id, setDirectKey],
    )
    const direct = useSWRImmutable<NodeWithEmbedded>(directKey, fetchNode)
    const usageKey = direct.isLoading || direct.data ? null : `${GBIF_URL}species/${encodeURIComponent(id)}`
    const usage = useSWRImmutable(usageKey, fetchNameUsage)
    const lineageIDs = React.useMemo(
        () =>
            GBIF_RANK_KEYS.map(key => usage.data?.[key])
                .filter(value => isFiniteNumber(value))
                .filter((value, index, array) => !array.slice(0, index).includes(value))
                .map(value => String(value)),
        [usage.data],
    )
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
        const node = direct.data ?? indirect.data
        if (node && dispatch) {
            dispatch({
                type: "RESOLVE_EXTERNAL",
                payload: node,
                meta: { authority: "gbif.org", namespace: "species", objectID: String(id) },
            })
        }
    }, [direct.data, dispatch, id, indirect.data])
    return null
}
export const GBIFResolve: React.FC = () => {
    const [state] = React.useContext(SearchContext) ?? []
    const unresolvedIDs = React.useMemo(() => {
        const ids = Object.keys(state?.externalResults["gbif.org"]?.species ?? {})
        return ids
            .filter(id => !state?.resolutions["gbif.org"]?.species?.[id])
            .map(id => parseInt(id, 10))
            .filter(isFinite)
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
