import { ImageWithEmbedded } from "@phylopic/api-models"
import { FC } from "react"
import LinkedImageThumbnailView from "../LinkedImageThumbnailView"
import styles from "./index.module.scss"
export interface Props {
    value: readonly ImageWithEmbedded[]
}
const ImageListView: FC<Props> = ({ value }) => {
    if (!value.length) {
        return null
    }
    return (
        <div className={styles.main}>
            {value.map(image => (
                <LinkedImageThumbnailView key={image.uuid} value={image} />
            ))}
        </div>
    )
}
export default ImageListView
