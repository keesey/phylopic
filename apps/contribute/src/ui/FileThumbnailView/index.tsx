import Image, { ImageLoader } from "next/future/image"
import React from "react"
import styles from "./index.module.scss"
export interface Props {
    alt?: string
    src: string
}
const loader: ImageLoader = props => props.src
const FileThumbnailView: React.FC<Props> = ({ alt, src }) => {
    return <Image alt={alt ?? ""} className={styles.main} height={64} loader={loader} src={src} width={64} />
}
export default FileThumbnailView
