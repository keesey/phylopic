import { Contributor, Image, INCOMPLETE_STRING } from "@phylopic/source-models"
import { AnchorLink } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
export type Props = {
    uuid: UUID
}
const ContributorViewer: FC<Props> = ({ uuid }) => {
    const { data: image } = useSWR<Image & { uuid: UUID }>(`/api/images/_/${encodeURIComponent(uuid)}`, fetchJSON)
    const { data: contributor } = useSWR<Contributor & { uuid: UUID }>(
        image?.contributor ? `/api/contributors/_/${encodeURIComponent(image?.contributor)}` : null,
        fetchJSON,
    )
    if (!image) {
        return null
    }
    if (!image.contributor) {
        return <>&hellip;</>
    }
    return (
        <AnchorLink href={`/contributors/${encodeURIComponent(image.contributor)}`}>
            {contributor ? contributor.name : INCOMPLETE_STRING}
        </AnchorLink>
    )
}
export default ContributorViewer