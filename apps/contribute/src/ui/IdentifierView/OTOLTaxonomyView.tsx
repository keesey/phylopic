import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import fetchJSON from "~/fetch/fetchJSON"
import NameView from "../NameView"
export type Props = {
    id: number
}
const OTOLTaxonomyView: FC<Props> = ({ id }) => {
    const { data } = useSWRImmutable<{ taxon: { unique_name: string } }>(
        {
            data: { ott_id: id },
            method: "POST",
            url: "https://api.opentreeoflife.org/v3/tree_of_life/node_info",
        },
        fetchJSON,
    )
    const name = useMemo(
        () => (data?.taxon?.unique_name ? parseNomen(data.taxon.unique_name) : null),
        [data?.taxon?.unique_name],
    )
    if (!name) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView value={name} />
}
export default OTOLTaxonomyView
