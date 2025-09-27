import Image from "next/image"
import { FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    name: "info" | "link" | "pencil" | "plus" | "trash"
}
const Icon: FC<Props> = ({ name }) => {
    return (
        <Image alt="" src={`/icons/${name}.svg`} className={styles.main} height={16} role="presentation" width={16} />
    )
}
export default Icon
