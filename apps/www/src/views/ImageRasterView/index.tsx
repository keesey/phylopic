import { ImageWithEmbedded } from "@phylopic/api-models"
import { ImageRasterView as UIImageRasterView } from "@phylopic/ui"
import { FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    value: ImageWithEmbedded
}
const ImageRasterView: FC<Props> = ({ value }) => {
    return (
        <div className={styles.main}>
            <figure className={styles.figure}>
                <UIImageRasterView value={value} />
            </figure>
        </div>
    )
}
export default ImageRasterView
