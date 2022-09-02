import { Hash } from "@phylopic/utils"
import { FC } from "react"
import useSubmission from "~/editing/useSubmission"
import FileThumbnailView from "../FileThumbnailView"
import IdentifierView from "../IdentifierView"
import styles from "./index.module.scss"
export type Props = {
    hash: Hash
}
const UserSubmissionThumbnail: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    return (
        <div className={styles.main}>
            <figure className={styles.figure}>
                <figcaption className={styles.caption}>
                    {submission?.status === "submitted" ? "Awaiting Review" : "Unfinished"}
                </figcaption>
                <FileThumbnailView
                    src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(hash)}`}
                />
                {submission?.identifier && (
                    <figcaption className={styles.caption}>
                        {<IdentifierView value={submission?.identifier} />}
                    </figcaption>
                )}
            </figure>
        </div>
    )
}
export default UserSubmissionThumbnail
