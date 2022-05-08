import { ImageWithEmbedded } from "@phylopic/api-models"
import { extractPath } from "@phylopic/utils"
import { FC } from "react"
import useImageAlt from "~/hooks/useImageAlt"
import AnchorLink from "~/ui/AnchorLink"
import ImageThumbnailView from "../ImageThumbnailView"
import styles from "./index.module.scss"
export interface Props {
    value: ImageWithEmbedded
}
const LinkedImageThumbnailView: FC<Props> = ({ value }) => {
    const title = useImageAlt(value)
    return (
        <AnchorLink className={styles.main} href={extractPath(value._links.self.href)} title={title}>
            <ImageThumbnailView value={value} />
        </AnchorLink>
    )
}
export default LinkedImageThumbnailView
