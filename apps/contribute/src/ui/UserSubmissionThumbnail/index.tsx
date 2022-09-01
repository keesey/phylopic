/* eslint-disable @next/next/no-img-element */
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSubmission from "~/editing/useSubmission"
import FileThumbnailView from "../FileThumbnailView"
import IdentifierView from "../IdentifierView"
import styles from "./index.module.scss"
export type Props = {
    uuid: UUID
}
const UserSubmissionThumbnail: FC<Props> = ({ uuid }) => {
    const submission = useSubmission(uuid)
    return (
        <figure>
            {submission?.file && (
                <FileThumbnailView
                    src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${submission?.file}`}
                />
            )}
            {submission?.identifier && (
                <figcaption className={styles.caption}>
                    <IdentifierView value={submission?.identifier} />
                </figcaption>
            )}
        </figure>
    )
}
export default UserSubmissionThumbnail
