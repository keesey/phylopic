import { ImageWithEmbedded } from "@phylopic/api-models"
import { AnchorLink, ImageThumbnailView, useImageAlt } from "@phylopic/ui"
import { extractPath } from "@phylopic/utils"
import clsx from "clsx"
import { FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    inverted?: boolean
    value: ImageWithEmbedded
}
const LinkedImageThumbnailView: FC<Props> = ({ inverted, value }) => {
    const title = useImageAlt(value)
    return (
        <AnchorLink
            className={clsx(!inverted && styles.standard, inverted && styles.inverted)}
            href={extractPath(value._links.self.href)}
            title={title}
        >
            <ImageThumbnailView value={value} />
        </AnchorLink>
    )
}
export default LinkedImageThumbnailView
