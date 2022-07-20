import Image, { ImageLoader } from "next/future/image"
import React from "react"
import styles from "./index.module.scss"
export interface Props {
    alt?: string
    src: string
}
const FileThumbnailView: React.FC<Props> = ({ alt, src }) => {
    return <Image alt={alt ?? ""} className={styles.main} height={96} src={src} unoptimized width={96} />
}
export default FileThumbnailView
