import { Contributor, INCOMPLETE_STRING, Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/utils-api"
import { Hash, UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import SubmissionNameView from "~/views/SubmissionNameView"
import styles from "./index.module.scss"
const SubmissionView: FC<{ hash: Hash }> = ({ hash }) => {
    const { data: submission, error } = useSWR<Submission>(`/api/submissions/_/${encodeURIComponent(hash)}`, fetchJSON)
    const { data: contributor } = useSWR<Contributor & { uuid: UUID }>(
        submission?.contributor ? `/api/contributors/_/${encodeURIComponent(submission.contributor)}` : null,
        fetchJSON,
    )
    if (error) {
        return (
            <>
                <strong>Error!</strong> {String(error)}
            </>
        )
    }
    if (!submission) {
        return <>{INCOMPLETE_STRING}</>
    }
    return (
        <div className={styles[submission.status]}>
            {submission ? <SubmissionNameView submission={submission} /> : INCOMPLETE_STRING}
            <> by </>
            {submission.attribution || "[Anonymous]"}
            <> (uploaded by {contributor ? contributor.name : INCOMPLETE_STRING})</>
        </div>
    )
}
export default SubmissionView
