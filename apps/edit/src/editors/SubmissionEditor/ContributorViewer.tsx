import { Contributor, INCOMPLETE_STRING, Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/utils-api"
import { Hash, UUID } from "@phylopic/utils"
import Link from "next/link"
import { FC } from "react"
import useSWR from "swr"
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
        <Link href={`/contributors/${encodeURIComponent(submission.contributor)}`}>
            {contributor ? contributor.name : INCOMPLETE_STRING}
        </Link>
    )
}
export default ContributorViewer
