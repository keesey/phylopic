import { AnchorLink } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import FileThumbnailView from "~/ui/FileThumbnailView"
import styles from "./index.module.scss"
export type ImageEntry = {
    readonly href: string
    readonly src: string
    readonly uuid: UUID
}
export type Props = {
    entries: readonly ImageEntry[]
}
const ImageGrid: FC<Props> = ({ entries }) => {
    return (
        <div className={styles.main}>
            {entries.map(({ href, src, uuid }) => (
                <AnchorLink key={uuid} href={href}>
                    <FileThumbnailView src={src} />
                </AnchorLink>
            ))}
        </div>
    )
}
export default ImageGrid
