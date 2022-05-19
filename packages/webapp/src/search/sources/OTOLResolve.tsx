import { NodeWithEmbedded } from "@phylopic/api-models"
import { FC, useContext, useEffect, useMemo } from "react"
import { Fetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import fetchDataAndCheck from "~/fetch/fetchDataAndCheck"
import SearchContext from "../context"
import OTOL_URL from "./OTOL_URL"
interface OTOLLineageItem {
    // Abridged.
    readonly ott_id: number
}
interface OTOLTaxonInfo {
    // Abridged.
    readonly lineage?: readonly OTOLLineageItem[]
}
const fetchLineage: Fetcher<OTOLTaxonInfo, [string, number, boolean]> = async (url, ott_id, include_lineage) => {
    const response = await fetchDataAndCheck<OTOLTaxonInfo>(url, {
        body: JSON.stringify({ include_lineage, ott_id }),
        headers: new Headers({ "content-type": "application/json" }),
        method: "POST",
    })
    return response.data
}
const fetchDirect: Fetcher<NodeWithEmbedded, [string]> = async url => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url)
    return response.data
}
const fetchIndirect: Fetcher<NodeWithEmbedded, [string, readonly number[]]> = async (url, objectIDs) => {
    const response = await fetchDataAndCheck<NodeWithEmbedded>(url, {
        body: JSON.stringify(objectIDs),
        method: "POST",
    })
    return response.data
}
const OTOLResolveObject: FC<{ ott_id: number }> = ({ ott_id }) => {
    const [, dispatch] = useContext(SearchContext) ?? []
    const direct = useSWRImmutable<NodeWithEmbedded>(
        `${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy/${encodeURIComponent(
            ott_id,
        )}?embed_primaryImage=true`,
        fetchDirect,
    )
    const lineage = useSWRImmutable([OTOL_URL + "/taxonomy/taxon_info", ott_id, true], fetchLineage)
    const lineageIDs = useMemo(() => {
        if (!lineage.data?.lineage) {
            return []
        }
        return lineage.data.lineage.map(({ ott_id: lineageID }) => String(lineageID))
    }, [lineage.data?.lineage])
    const indirect = useSWRImmutable<NodeWithEmbedded>(
        lineageIDs.length
            ? [
                  `${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy?embed_primaryImage=true`,
                  lineageIDs,
              ]
            : null,
        fetchIndirect,
    )
    useEffect(() => {
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
const OTOLResolve: FC = () => {
    const [state] = useContext(SearchContext) ?? []
    const unresolvedOTTIDs = useMemo(() => {
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
