import Image from "next/image"
import { FC } from "react"
import styles from "./index.module.scss"
export type Props = {
    alt: string
    src: string
}
const Icon: FC<Props> = ({ alt, src }) => {
    return <Image alt={alt} src={src} className={styles.main} unoptimized width={32} height={32} />
}
export default Icon
