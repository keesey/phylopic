import { Contributor, INCOMPLETE_STRING, Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash, UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import SubmissionNameView from "~/views/SubmissionNameView"
import styles from "./index.module.scss"
import clsx from "clsx"
import Link from "next/link"
const SubmissionView: FC<{ hash: Hash }> = ({ hash }) => {
    const { data: submission, error } = useSWR<Submission>(`/api/submissions/_/${encodeURIComponent(hash)}`, fetchJSON)
    const { data: contributor } = useSWR<Contributor & { uuid: UUID }>(
        submission?.contributor ? `/api/contributors/_/${encodeURIComponent(submission.contributor)}` : null,
        fetchJSON,
    )
    if (error) {
        return (
            <tr>
                <td colSpan={3}>
                    <strong>Error!</strong> {String(error)}
                </td>
            </tr>
        )
    }
    if (!submission) {
        return <>{INCOMPLETE_STRING}</>
    }
    return (
        <tr className={clsx(styles.main, styles[submission.status])}>
            <td>
                <Link href={contributor?.uuid ? `/contributors/${encodeURIComponent(contributor.uuid)}` : "#"}>
                    {contributor ? contributor.name : INCOMPLETE_STRING}
                </Link>
            </td>
            <td>
                <Link href={`/submissions/${encodeURIComponent(hash)}`}>
                    {submission ? <SubmissionNameView submission={submission} /> : INCOMPLETE_STRING}
                </Link>
            </td>
            <td>
                <Link href={`/submissions/${encodeURIComponent(hash)}`}>{submission.attribution || "[Anonymous]"}</Link>
            </td>
        </tr>
    )
}
export default SubmissionView
