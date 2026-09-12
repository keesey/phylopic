import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/utils-api"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "../NameView"
export type Props = {
    id: number
}
const OTOLTaxonomyView: FC<Props> = ({ id }) => {
    const { data } = useSWRImmutable<{ unique_name: string }>(
        {
            data: { ott_id: id },
            method: "POST",
            url: "https://api.opentreeoflife.org/v3/taxonomy/taxon_info",
        },
        fetchJSON,
    )
    const name = useMemo(() => (data?.unique_name ? parseNomen(data.unique_name) : null), [data?.unique_name])
    if (!name) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView name={name} />
}
export default OTOLTaxonomyView
