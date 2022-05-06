import { MediaLink } from "@phylopic/api-models"
import React, { useMemo, FC } from "react"
import getImageFileExtension from "~/files/getImageFileExtension"
import styles from "./DownloadLink.module.scss"
export interface Props {
    filenamePrefix: string
    link: MediaLink
}
const DownLoadLink: FC<Props> = ({ filenamePrefix, link }) => {
    const text = useMemo(() => link.sizes.replace("x", " × ") + " pixels", [link.sizes])
    const filename = useMemo(
        () => `${filenamePrefix}_${link.sizes}_${getImageFileExtension(link.type)}`,
        [filenamePrefix, link],
    )
    return (
        <a className={styles.main} download={filename} href={link.href}>
            {text}
        </a>
    )
}
export default DownLoadLink
