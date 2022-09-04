import { Hash } from "@phylopic/utils"
import clsx from "clsx"
import { FC } from "react"
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
    return (
        <div className={clsx(styles.main, submission && styles[submission.status])}>
            <figure className={styles.figure}>
                <FileThumbnailView
                    src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(hash)}`}
                />
                {submission?.identifier && (
                    <figcaption className={styles.caption}>
                        {submission.newTaxonName ? (
                            <NameRenderer value={submission.newTaxonName} />
                        ) : (
                            <IdentifierView value={submission?.identifier} />
                        )}
                    </figcaption>
                )}
            </figure>
        </div>
    )
}
export default UserSubmissionThumbnail
