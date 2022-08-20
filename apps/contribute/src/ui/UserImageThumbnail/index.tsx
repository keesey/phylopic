import { stringifyNomen, UUID } from "@phylopic/utils"
import { FC } from "react"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import NameView from "../NameView"
import styles from "./index.module.scss"
export type Props = {
    uuid: UUID
}
const UserImageThumbnail: FC<Props> = ({ uuid }) => {
    const src = useImageSrc(uuid)
    const specific = useImageNode(uuid, "specific")
    if (!src) {
        return null
    }
    return (
        <figure>
            <img
                alt={specific ? stringifyNomen(specific.names[0]) : "silhouette image"}
                className={styles.main}
                src={src}
            />
            <figcaption className={styles.caption}>
                {specific && <NameView value={specific.names[0]} short />}
                {!specific && " "}
            </figcaption>
        </figure>
    )
}
export default UserImageThumbnail
