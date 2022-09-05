import { Contributor, INCOMPLETE_STRING, Submission } from "@phylopic/source-models"
import { AnchorLink } from "@phylopic/ui"
import { Hash, UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
export type Props = {
    hash: Hash
}
const ContributorViewer: FC<Props> = ({ hash }) => {
    const { data: submission } = useSWR<Submission>(`/api/submissions/_/${encodeURIComponent(hash)}`, fetchJSON)
    const { data: contributor } = useSWR<Contributor & { uuid: UUID }>(
        submission?.contributor ? `/api/contributors/_/${encodeURIComponent(submission?.contributor)}` : null,
        fetchJSON,
    )
    if (!submission) {
        return null
    }
    if (!submission.contributor) {
        return <>&hellip;</>
    }
    return (
        <AnchorLink href={`/contributors/${encodeURIComponent(submission.contributor)}`}>
            {contributor ? contributor.name : INCOMPLETE_STRING}
        </AnchorLink>
    )
}
export default ContributorViewer
