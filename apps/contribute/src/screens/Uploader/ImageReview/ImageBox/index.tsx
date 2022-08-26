/* eslint-disable @next/next/no-img-element */
import clsx from "clsx"
import { FC } from "react"
import styles from "./index.module.scss"
export type Props = {
    alt: string
    mode: "portrait" | "landscape"
    onClick: () => void
    source: string
}
const ImageBox: FC<Props> = ({ alt, mode, onClick, source }) => {
    return (
        <a onClick={onClick} role="button" className={clsx(styles.main, styles[mode])} title={alt}>
            <img alt={alt} src={source} />
        </a>
    )
}
export default ImageBox
