import { AnchorLink } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import FileThumbnailView from "~/ui/FileThumbnailView"
import styles from "./index.module.scss"
export type Props = {
    uuids: readonly UUID[]
}
const ImageGrid: FC<Props> = ({ uuids }) => {
    return (
        <div className={styles.main}>
            {uuids.map(uuid => (
                <AnchorLink key={uuid} href={`/edit/${encodeURIComponent(uuid)}`}>
                    <FileThumbnailView uuid={uuid} />
                </AnchorLink>
            ))}
        </div>
    )
}
export default ImageGrid
