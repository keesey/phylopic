import { DATA_MEDIA_TYPE, Image } from "@phylopic/api-models"
import { ImageThumbnailView } from "@phylopic/ui"
import { extractPath, stringifyNormalized } from "@phylopic/utils"
import clsx from "clsx"
import Link from "next/link"
import { DragEvent, FC } from "react"
import customEvents from "~/analytics/customEvents"
import styles from "./index.module.scss"
export interface Props {
    inverted?: boolean
    value: Image
}
const LinkedImageThumbnailView: FC<Props> = ({ inverted, value }) => {
    const handleDragStart = (event: DragEvent) => {
        customEvents.dragImage("thumbnail", value)
        event.dataTransfer.setData(DATA_MEDIA_TYPE, stringifyNormalized(value))
    }
    return (
        <Link
            className={clsx(styles.main, !inverted && styles.standard, inverted && styles.inverted)}
            draggable
            href={extractPath(value._links.self.href)}
            onClick={() => customEvents.clickImageLink("thumbnail", value, undefined, "button")}
            onDragStart={handleDragStart}
            title={value._links.self.title}
        >
            <ImageThumbnailView value={value} />
        </Link>
    )
}
export default LinkedImageThumbnailView
