import { FC, ReactNode } from "react"
import styles from "./index.module.scss"

export interface Props {
    children: ReactNode
}
const BulletList: FC<Props> = ({ children }) => {
    return <ul className={styles.main}>{children}</ul>
}
export default BulletList
