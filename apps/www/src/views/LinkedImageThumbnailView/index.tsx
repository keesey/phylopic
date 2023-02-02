import { DATA_MEDIA_TYPE, ImageWithEmbedded } from "@phylopic/api-models"
import { ImageThumbnailView, useImageAlt } from "@phylopic/ui"
import { extractPath, stringifyNormalized } from "@phylopic/utils"
import clsx from "clsx"
import Link from "next/link"
import { DragEvent, FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    inverted?: boolean
    value: ImageWithEmbedded
}
const LinkedImageThumbnailView: FC<Props> = ({ inverted, value }) => {
    const title = useImageAlt(value)
    const handleDragStart = (event: DragEvent) => {
        event.dataTransfer.setData(DATA_MEDIA_TYPE, stringifyNormalized(value))
    }
    return (
        <Link
            className={clsx(styles.main, !inverted && styles.standard, inverted && styles.inverted)}
            draggable
            href={extractPath(value._links.self.href)}
            onDragStart={handleDragStart}
            title={title}
        >
            <ImageThumbnailView value={value} />
        </Link>
    )
}
export default LinkedImageThumbnailView
