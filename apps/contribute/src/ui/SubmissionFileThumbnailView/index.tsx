import { useNomenText } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useFileSource from "~/editing/useFileSource"
import useRatioComplete from "~/editing/useRatioComplete"
import useSpecific from "~/editing/useSpecific"
import FileThumbnailView from "../FileThumbnailView"
import styles from "./index.module.scss"
export interface Props {
    uuid: UUID
}
const SubmissionFileThumbnailView: FC<Props> = ({ uuid }) => {
    const { data: src } = useFileSource(uuid)
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
