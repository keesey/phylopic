import { isSubmission, Submission } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import clsx from "clsx"
import { FC, useMemo } from "react"
import useSubmission from "~/editing/useSubmission"
import NameRenderer from "~/screens/Assignment/NodeForm/NameRenderer"
import FileThumbnailView from "../FileThumbnailView"
import IdentifierView from "../IdentifierView"
import styles from "./index.module.scss"
export type Props = {
    hash: Hash
}
const UserSubmissionThumbnail: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    const submittable = useMemo(
        () => (submission ? isSubmission({ ...submission, status: "submitted" } as Submission) : null),
        [submission],
    )
    return (
        <div className={clsx(styles.main, submission && styles[submission.status])}>
            <figure className={styles.figure}>
                <FileThumbnailView
                    src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(hash)}`}
                />
                <figcaption className={styles.caption}>
                    {submission?.identifier && (
                        <>
                            {submission.newTaxonName ? (
                                <NameRenderer value={submission.newTaxonName} />
                            ) : (
                                <IdentifierView value={submission?.identifier} />
                            )}
                        </>
                    )}
                    <br />
                    <strong>
                        {submission?.status === "submitted"
                            ? "Awaiting Review"
                            : submittable
                            ? "Ready to Submit"
                            : "Incomplete"}
                    </strong>
                </figcaption>
            </figure>
        </div>
    )
}
export default UserSubmissionThumbnail
