import { MediaLink } from "@phylopic/api-models"
import React, { FC, useMemo } from "react"
import getImageFileExtension from "~/files/getImageFileExtension"
import DimensionView from "./DimensionView"
import styles from "./DownloadLink.module.scss"
export interface Props {
    filenamePrefix: string
    link: MediaLink
}
const DownLoadLink: FC<Props> = ({ filenamePrefix, link }) => {
    const [width, height] = useMemo(() => link.sizes.split("x").map(parseFloat), [link.sizes])
    const filename = useMemo(
        () => `${filenamePrefix}_${link.sizes}_${getImageFileExtension(link.type)}`,
        [filenamePrefix, link],
    )
    return (
        <a className={styles.main} download={filename} href={link.href}>
            <DimensionView value={width} />
            {" × "}
            <DimensionView value={height} />
        </a>
    )
}
export default DownLoadLink
