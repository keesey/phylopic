import Image from "next/future/image"
import { FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    name: "link" | "pencil" | "plus" | "trash"
}
const Icon: FC<Props> = ({ name }) => {
    return (
        <Image alt="" src={`/icons/${name}.svg`} className={styles.main} height={16} role="presentation" width={16} />
    )
}
export default Icon
