import Image from "next/image"
import type { FC } from "react"
import type { FileResult } from "../../SelectFile/FileResult"
import styles from "./index.module.scss"
export type Props = Pick<FileResult, "size" | "source"> & {
    alt: string
}
const AREA = 512 * 512
const getSize = (size: FileResult["size"]): FileResult["size"] => {
    const ratio = size[0] / size[1]
    const w = Math.sqrt(AREA * ratio)
    const h = AREA / w
    return [w, h]
}
const ImageBox: FC<Props> = ({ alt, source, size }) => {
    const adjustedSize = getSize(size)
    return (
        <div className={styles.main} style={{ width: adjustedSize[0], height: adjustedSize[1] }}>
            <Image alt={alt} src={source} unoptimized layout="fill" />
        </div>
    )
}
export default ImageBox
