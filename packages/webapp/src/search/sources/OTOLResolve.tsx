import axios from "axios"
import { NodeWithEmbedded } from "@phylopic/api-models"
import { useContext, useEffect, useMemo, FC } from "react"
import { Fetcher } from "swr"
import useSWR from "swr/immutable"
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
    const response = await axios.post<OTOLTaxonInfo>(url, { ott_id, include_lineage })
    return response.data
}
const fetchDirect: Fetcher<NodeWithEmbedded, [string]> = async url => {
    const response = await axios.get(url)
    return response.data
}
const fetchIndirect: Fetcher<NodeWithEmbedded, [string, readonly number[]]> = async (url, objectIDs) => {
    const response = await axios.post(url, objectIDs)
    return response.data
}
const OTOLResolveObject: FC<{ ott_id: number }> = ({ ott_id }) => {
    const [, dispatch] = useContext(SearchContext) ?? []
    const direct = useSWR<NodeWithEmbedded>(
        `${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy/${encodeURIComponent(
            ott_id,
        )}?embed_primaryImage=true`,
        fetchDirect,
    )
    const lineage = useSWR([OTOL_URL + "/taxonomy/taxon_info", ott_id, true], fetchLineage)
    const lineageIDs = useMemo(() => {
        if (!lineage.data?.lineage) {
            return []
        }
        return lineage.data.lineage.map(({ ott_id: lineageID }) => String(lineageID))
    }, [lineage.data?.lineage])
    const indirect = useSWR<NodeWithEmbedded>(
        lineageIDs.length
            ? [`${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy?embed_primaryImage=true`, lineageIDs]
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
