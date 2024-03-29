import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "../NameView"
export type Props = {
    id: number
}
const GBIFSpeciesView: FC<Props> = ({ id }) => {
    const { data } = useSWRImmutable<{ canonicalName?: string; scientificName?: string }>(
        `https://api.gbif.org/v1/species/${encodeURIComponent(id)}`,
        fetchJSON,
    )
    const name = useMemo(() => {
        const nameSource = data?.scientificName ?? data?.canonicalName
        return nameSource ? parseNomen(nameSource) : null
    }, [data?.canonicalName, data?.scientificName])
    if (!name) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView value={name} />
}
export default GBIFSpeciesView
