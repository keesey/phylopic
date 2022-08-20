import { FC } from "react"
import styles from "./index.module.scss"
export type Props = {
    alt: string
    src: string
}
const Icon: FC<Props> = ({ alt, src }) => {
    return <img alt={alt} src={src} className={styles.main} />
}
export default Icon
