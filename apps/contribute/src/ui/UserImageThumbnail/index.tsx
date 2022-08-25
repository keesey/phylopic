/* eslint-disable @next/next/no-img-element */
import { stringifyNomen, UUID } from "@phylopic/utils"
import { FC } from "react"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import FileThumbnailView from "../FileThumbnailView"
import NameView from "../NameView"
import styles from "./index.module.scss"
export type Props = {
    uuid: UUID
}
const UserImageThumbnail: FC<Props> = ({ uuid }) => {
    const src = useImageSrc(uuid)
    const specific = useImageNode(uuid, "specific")
    return (
        <figure>
            <FileThumbnailView alt={specific ? stringifyNomen(specific.names[0]) : undefined} src={src} />
            <figcaption className={styles.caption}>
                {specific && <NameView value={specific.names[0]} short />}
                {!specific && " "}
            </figcaption>
        </figure>
    )
}
export default UserImageThumbnail
