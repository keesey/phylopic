import { isJWT } from "@phylopic/source-models"
import { useNomenText } from "@phylopic/ui"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useRatioComplete from "~/editing/useRatioComplete"
import useSpecific from "~/editing/useSpecific"
import FileThumbnailView from "../FileThumbnailView"
import styles from "./index.module.scss"
export interface Props {
    uuid: UUID
}
const SubmissionFileThumbnailView: FC<Props> = ({ uuid }) => {
    const token = useAuthToken()
    const src = useMemo(
        () =>
            isUUIDv4(uuid) && isJWT(token)
                ? `/api/submissions/${encodeURIComponent(uuid)}/source?token=${encodeURIComponent(token)}`
                : undefined,
        [token, uuid],
    )
    const { data: specific } = useSpecific(uuid)
    const ratioComplete = useRatioComplete(uuid)
    const alt = useNomenText(specific?.name)
    return (
        <figure className={styles.main}>
            <FileThumbnailView src={src} alt={alt} />
            {!isNaN(ratioComplete) && ratioComplete < 1 && (
                <figcaption className={styles.caption}>
                    <progress className={styles.progress} value={ratioComplete} max={1} />
                </figcaption>
            )}
        </figure>
    )
}
export default SubmissionFileThumbnailView
