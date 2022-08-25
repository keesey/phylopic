import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const NoBreak: FC<Props> = ({ children }) => <span className={styles.main}>{children}</span>
export default NoBreak