import { NodeWithEmbedded } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import { BuildContext, fetchDataAndCheck } from "@phylopic/utils-api"
import { useDebounce } from "@react-hook/debounce"
import React, { useContext } from "react"
import type { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import SearchContext from "../../context"
import DEBOUNCE_WAIT from "../DEBOUNCE_WAIT"
import OTOL_URL from "./OTOL_URL"
interface OTOLLineageItem {
    // Abridged.
    readonly ott_id: number
}
interface OTOLTaxonInfo {
    // Abridged.
    readonly lineage?: readonly OTOLLineageItem[]
}
const fetchLineage: Fetcher<OTOLTaxonInfo, [string, number, boolean]> = async ([url, ott_id, include_lineage]) => {
    const response = await fetchDataAndCheck<OTOLTaxonInfo>(url, {
        data: { include_lineage, ott_id },
        headers: { "content-type": "application/json" },
        method: "POST",
    })
    return response.data
}
const fetchDirect: Fetcher<NodeWithEmbedded, [string]> = async ([url]) => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url)
    return response.data
}
const fetchIndirect: Fetcher<NodeWithEmbedded, [string, readonly number[]]> = async ([url, objectIDs]) => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, {
        data: objectIDs,
        headers: { "content-type": "application/json" },
        method: "POST",
    })
    return response.data
}
const OTOLResolveObject: React.FC<{ ott_id: number }> = ({ ott_id }) => {
    const [build] = useContext(BuildContext) ?? []
    const [, dispatch] = React.useContext(SearchContext) ?? []
    const [directKey, setDirectKey] = useDebounce<string | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setDirectKey(
                ott_id
                    ? `${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy/${encodeURIComponent(
                          ott_id,
                      )}${createSearch({
                          build,
                          embed_primaryImage: true,
                      })}`
                    : null,
            ),
        [build, ott_id, setDirectKey],
    )
    const direct = useSWRImmutable<NodeWithEmbedded>(directKey, fetchDirect)
    const lineage = useSWRImmutable([OTOL_URL + "/taxonomy/taxon_info", ott_id, true], fetchLineage)
    const lineageIDs = React.useMemo(() => {
        if (!lineage.data?.lineage) {
            return [String(ott_id)]
        }
        return [String(ott_id), ...lineage.data.lineage.map(({ ott_id: lineageID }) => String(lineageID))]
    }, [lineage.data?.lineage, ott_id])
    const [indirectKey, setIndirectKey] = useDebounce<[string, string[]] | null>(null, DEBOUNCE_WAIT, true)
    React.useEffect(
        () =>
            setIndirectKey(
                lineageIDs.length
                    ? ([
                          `${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy${createSearch({
                              build,
                              embed_primaryImage: true,
                          })}`,
                          lineageIDs,
                      ] as [string, string[]])
                    : null,
            ),
        [build, lineageIDs, setIndirectKey],
    )
    const indirect = useSWRImmutable<NodeWithEmbedded>(indirectKey, fetchIndirect)
    React.useEffect(() => {
        const node = direct.data ?? indirect.data
        if (node && dispatch) {
            dispatch({
                type: "RESOLVE_EXTERNAL",
                payload: node,
                meta: { authority: "opentreeoflife.org", namespace: "taxonomy", objectID: String(ott_id) },
            })
        }
    }, [direct.data, dispatch, indirect.data, ott_id])
    return null
}
export const OTOLResolve: React.FC = () => {
    const [state] = React.useContext(SearchContext) ?? []
    const unresolvedOTTIDs = React.useMemo(() => {
        const ott_ids = Object.keys(state?.externalResults["opentreeoflife.org"]?.taxonomy ?? {})
        return ott_ids
            .filter(id => !state?.resolutions["opentreeoflife.org"]?.taxonomy?.[id])
            .map(id => parseInt(id, 10))
            .filter(isFinite)
            .sort()
    }, [state?.externalResults, state?.resolutions])
    return (
        <>
            {unresolvedOTTIDs.map(id => (
                <OTOLResolveObject key={id} ott_id={id} />
            ))}
        </>
    )
}
export default OTOLResolve
