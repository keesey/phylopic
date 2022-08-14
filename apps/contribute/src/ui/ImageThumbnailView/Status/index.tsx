import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useRatioComplete from "~/editing/hooks/steps/useRatioComplete"
import useLiveImageExists from "~/editing/hooks/useLiveImageExists"
import styles from "./index.module.scss"
export type Props = {
    image?: Image & { uuid: UUID }
}
const Status: FC<Props> = ({ image }) => {
    const isLive = useLiveImageExists(image?.uuid)
    const ratioComplete = useRatioComplete(image?.uuid)
    const ratio = useMemo(() => {
        if (!image) {
            return NaN
        }
        if (image.accepted) {
            if (!image.submitted) {
                return -1
            }
            return isLive === undefined ? NaN : isLive ? 1 : 0
        }
        if (image.submitted) {
            return 1
        }
        return ratioComplete
    }, [image, isLive, ratioComplete])
    if (ratio < 0) {
        return null
    }
    return (
        <progress className={styles.main} max={isNaN(ratio) ? undefined : 1} value={isNaN(ratio) ? undefined : ratio} />
    )
}
export default Status
