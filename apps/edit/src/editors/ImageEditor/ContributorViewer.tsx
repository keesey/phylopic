import { type Contributor, type Image, INCOMPLETE_STRING } from "@phylopic/source-models"
import type { UUID } from "@phylopic/utils"
import { fetchJSON } from "@phylopic/utils-api"
import Link from "next/link"
import type { FC } from "react"
import useSWR from "swr"
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
        <Link href={`/contributors/${encodeURIComponent(image.contributor)}`}>
            {contributor ? contributor.name : INCOMPLETE_STRING}
        </Link>
    )
}
export default ContributorViewer
