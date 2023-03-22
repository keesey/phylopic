import { DATA_MEDIA_TYPE, Image } from "@phylopic/api-models"
import { ImageRasterView as UIImageRasterView } from "@phylopic/ui"
import { stringifyNormalized } from "@phylopic/utils"
import { DragEvent, FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    value: Image
}
const ImageRasterView: FC<Props> = ({ value }) => {
    const handleDragStart = (event: DragEvent) => {
        event.dataTransfer.setData(DATA_MEDIA_TYPE, stringifyNormalized(value))
    }
    return (
        <div className={styles.main}>
            <figure className={styles.figure} draggable onDragStart={handleDragStart}>
                <UIImageRasterView value={value} />
            </figure>
        </div>
    )
}
export default ImageRasterView
